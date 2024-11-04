const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

/**
 * Middleware to authenticate JWT tokens.
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @param {Function} next The next middleware function in the stack.
 */
const authenticateToken = asyncHandler(async (req, res, next) => {
    console.log('Middleware authenticateToken called'); // Log for middleware call
    const authHeader = req.headers['authorization'];
    
    // Extract token from the header
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        console.error('Authentication token is missing.');
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error('Invalid or expired token:', err.message);
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        
        // Check if userId is present in the decoded token payload
        if (!decoded.userId) {
            return res.status(400).json({ message: 'Invalid token structure: userId missing.' });
        }
    
        // Attach decoded user information to the request object
        req.user = decoded; // Make sure req.user includes userId, username, etc.
        console.log('Token verified. User ID:', req.user.userId); // Log the user ID for debugging
        next();
    });
});

module.exports = authenticateToken;
