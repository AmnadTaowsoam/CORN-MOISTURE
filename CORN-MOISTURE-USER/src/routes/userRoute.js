const express = require("express");
const router = express.Router();
const { body, validationResult, param } = require("express-validator");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const authenticateToken = require("../middleware/authenticateToken");

const validateUser = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters long"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a new user
router.post("/", validateUser, handleValidationErrors, asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.createUser({ username, email, password: hashedPassword });
  res.status(201).json(user);
}));

// Route to get all users
router.get("/", asyncHandler(async (req, res) => {
  const users = await UserModel.getAllUsers();
  res.json(users);
}));

// Route to get a user by ID (with validation specific to ID)
router.get("/:id", param("id").isUUID().withMessage("Valid user ID is required"), handleValidationErrors, asyncHandler(async (req, res) => {
  const user = await UserModel.findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}));

// Route to update a user by ID (with validation specific to ID)
router.put("/:id", [
  param("id").isUUID().withMessage("Valid user ID is required"),
  ...validateUser,
], handleValidationErrors, asyncHandler(async (req, res) => {
  const updatedUser = await UserModel.updateUser(req.params.id, req.body);
  res.json(updatedUser);
}));

// Route to delete a user by ID (with validation specific to ID)
router.delete("/:id", param("id").isUUID().withMessage("Valid user ID is required"), handleValidationErrors, asyncHandler(async (req, res) => {
  const user = await UserModel.deleteUser(req.params.id);
  res.json({ message: "User deleted successfully", user });
}));

// Route to get current user's profile (no ID validation)
router.get("/profile", authenticateToken, asyncHandler(async (req, res) => {
  const user = await UserModel.findUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
}));

// Route to update current user's profile (no ID validation)
router.put("/profile", authenticateToken, handleValidationErrors, asyncHandler(async (req, res) => {
  const updatedUser = await UserModel.updateUser(req.user.userId, req.body);
  res.json(updatedUser);
}));

// Route to change current user's password
router.put("/change-password", authenticateToken, [
  body("newPassword").isLength({ min: 5 }).withMessage("Password must be at least 5 characters long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
], handleValidationErrors, asyncHandler(async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
  const updatedUser = await UserModel.updateUser(req.user.userId, { password: hashedPassword });
  res.json({ message: "Password updated successfully", user: updatedUser });
}));

// Route to get user information by username
router.get('/get-user-info/:username', authenticateToken, asyncHandler(async (req, res) => {
  const user = await UserModel.findUserByUsername(req.params.username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // Return relevant user information (exclude sensitive fields like password)
  res.json({ username: user.username, email: user.email, roles: user.roles });
}));

module.exports = router;
