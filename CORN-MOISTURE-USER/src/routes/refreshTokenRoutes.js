const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { body, param } = require("express-validator");
const RefreshTokenModel = require("../models/refreshTokenModel");

// Get a refresh token by token string
router.get("/:token", [
  param("token").notEmpty().withMessage("Token is required")
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const token = await RefreshTokenModel.getRefreshToken(req.params.token);
  if (!token) {
    return res.status(404).json({ message: "Refresh token not found" });
  }
  res.json(token);
}));

// Create a refresh token
router.post("/", [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("token").notEmpty().withMessage("Token is required"),
  body("expiresAt").isISO8601().toDate().withMessage("Valid expiration date is required")
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, token, expiresAt } = req.body;
  await RefreshTokenModel.createRefreshToken(userId, token, expiresAt);
  res.status(201).json({ message: "Refresh token created successfully" });
}));

// Update a refresh token
router.put("/:token", [
  param("token").notEmpty().withMessage("Token is required"),
  body("newToken").notEmpty().withMessage("New token is required"),
  body("newExpiresAt").isISO8601().toDate().withMessage("Valid expiration date is required")
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { newToken, newExpiresAt } = req.body;
  const updatedToken = await RefreshTokenModel.updateRefreshToken(req.params.token, newToken, newExpiresAt);
  if (!updatedToken) {
    return res.status(404).json({ message: "Refresh token not found" });
  }
  res.json({ message: "Refresh token updated successfully", updatedToken });
}));

// Delete a refresh token
router.delete("/:token", [
  param("token").notEmpty().withMessage("Token is required")
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const deleted = await RefreshTokenModel.deleteRefreshToken(req.params.token);
  if (!deleted) {
    return res.status(404).json({ message: "Refresh token not found" });
  }
  res.json({ message: "Refresh token deleted successfully" });
}));

module.exports = router;

