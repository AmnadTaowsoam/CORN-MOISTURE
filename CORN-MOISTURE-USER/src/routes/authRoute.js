const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { findUserByUsername } = require('../models/userModel');
const { createRefreshToken, getRefreshToken, deleteRefreshToken } = require('../models/refreshTokenModel');

const router = express.Router();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    console.error('Error: ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set');
    process.exit(1);
}

// Function to generate access token
const generateAccessToken = (userId, username, role) => {
    return jwt.sign({ userId, username, role }, ACCESS_TOKEN_SECRET, { expiresIn: '1440m' });
};

// Function to generate refresh token
const generateRefreshToken = async (userId) => {
    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    await createRefreshToken(userId, refreshToken, expiresAt);
    return refreshToken;
};

// Validate login input
const validateLogin = [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('password').not().isEmpty().withMessage('Password is required')
];

router.post('/login', validateLogin, asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    
    if (user) {
        console.log("Login - Retrieved user from database:", user);
        
        // Check if the password matches and log the result
        const isMatch = await bcrypt.compare(password, user.pwd);
        console.log("Login - Password match status for user:", isMatch);

        if (isMatch) {
            const accessToken = generateAccessToken(user.user_id, user.username, user.roles); 
            const refreshToken = await generateRefreshToken(user.user_id);

            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV !== 'development', path: '/api/auth/refreshToken' });
            return res.json({ accessToken, roles: user.roles, port: user.port });
        } else {
            console.warn(`Login failed for user: ${username}. Reason: Incorrect password.`);
        }
    } else {
        console.warn(`Login failed for user: ${username}. Reason: User not found.`);
    }

    return res.status(401).json({ message: 'Username or password is incorrect' });
}));


module.exports = router;
