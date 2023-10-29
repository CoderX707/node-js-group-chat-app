const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const { authorizeUser, adminAuthMiddleware } = require("../middleware");

router.post(
  "/admin",
  [
    check("name", "Name is required").not().isEmpty(),
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("isAdmin", "isAdmin is required").not().isEmpty(),
  ],
  authController.admin
);

router.post(
  "/login",
  [
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ],
  authController.login
);

router.post(
  "/create-user",
  authorizeUser,
  adminAuthMiddleware,
  [
    check("name", "Name is required").not().isEmpty(),
    check("username", "Username is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ],
  authController.createUser
);

router.post(
  "/update-user/:id",
  authorizeUser,
  adminAuthMiddleware,
  authController.updateUser
);

module.exports = router;
