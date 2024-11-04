const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/userModel");

const validateRegistration = [
  body("username").notEmpty().withMessage("Username is required").trim().escape(),
  body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("roles").notEmpty().withMessage("Role is required").trim().escape(),
  body("port").isInt({ min: 1, max: 65535 }).withMessage("Port must be a valid integer between 1 and 65535"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register new user
router.post(
  "/",
  validateRegistration,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { username, password, email, roles, port } = req.body;

    // Check if user already exists
    const userExists = await UserModel.findUserByUsername(username);
    if (userExists) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    // Hash the user's password and log it
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Registration - Hashed password for user:", hashedPassword);

    // Create new user with the hashed password
    const newUser = await UserModel.createUser({
      username,
      password: hashedPassword, // Pass the hashed password
      email,
      roles,
      port,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  })
);

module.exports = router;


module.exports = router;
