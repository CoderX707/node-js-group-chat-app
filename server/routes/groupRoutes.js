const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const { authorizeUser } = require("../middleware");
const { check } = require("express-validator");

router.post(
  "/create",
  authorizeUser,
  [check("name", "Name is required").not().isEmpty()],
  groupController.create
);

router.delete("/delete/:groupId", authorizeUser, groupController.delete);

router.get("/search", authorizeUser, groupController.search);
router.get("/users", authorizeUser, groupController.getAllUsers);

router.post(
  "/add-member/:groupId",
  authorizeUser,
  [check("memberId", "Member id is required").not().isEmpty()],
  groupController.addUser
);

module.exports = router;
