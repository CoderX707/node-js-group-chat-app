const { validationResult } = require("express-validator");
const Group = require("../models/Group");
const User = require("../models/User");

exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    const newGroup = new Group({
      name,
      members: [req.user.id],
    });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating group" });
  }
};

exports.delete = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Access denied: You are not a member of this group" });
    }

    await group.deleteOne();

    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting group" });
  }
};

exports.search = async (req, res) => {
  try {
    const searchQuery = req.query.name;
    if (req.user.isAdmin) {
      const groups = await Group.find({
        name: { $regex: new RegExp(searchQuery, 'i') }
      });
      res.json(groups);
    } else {
      const userId = req.user.id;
      const groups = await Group.find({
        $and: [
          { $or: [{ name: { $regex: searchQuery, $options: "i" } }] },
          { members: userId },
        ],
      });
      res.json(groups);
    }
  } catch (error) {
    res.status(500).json({ message: "Error searching for groups" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name _id");

    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Access denied: You are not a member of this group" });
    }

    const { memberId } = req.body;
    const userToAdd = await User.findById(memberId);

    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    if (group.members.includes(userToAdd._id)) {
      return res
        .status(400)
        .json({ message: "User is already a member of this group" });
    }

    group.members.push(userToAdd._id);
    await group.save();

    res.json({ message: "User added to the group successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding member to the group" });
  }
};
