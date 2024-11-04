// middleware/authenticateAPIKey.js
require('dotenv').config();

function authenticateAPIKey(req, res, next) {
    const apiKey = req.header('x-api-key');
    const validApiKey = process.env.API_KEY;

    if (!apiKey || apiKey !== validApiKey) {
        return res.status(403).json({ error: 'Invalid API key' });
    }

    next();
}

module.exports = authenticateAPIKey;
