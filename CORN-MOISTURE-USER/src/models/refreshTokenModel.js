const { users } = require('../config/dbconfig');

const getRefreshToken = async (token) => {
    try {
        const result = await users.query('SELECT * FROM users.user_tokens WHERE refresh_token = $1', [token]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error retrieving refresh token:', error.message);
        throw error;
    }
};

const createRefreshToken = async (userId, token, expiresAt) => {
    try {
        await users.query(
            'INSERT INTO users.user_tokens (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)',
            [userId, token, expiresAt]
        );
    } catch (error) {
        console.error('Error creating refresh token:', error.message);
        throw new Error('Failed to create refresh token');
    }
};

const findRefreshToken = async (token) => {
    try {
        const result = await users.query(
            'SELECT * FROM users.user_tokens WHERE refresh_token = $1',
            [token]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error finding refresh token:', error.message);
        throw new Error('Failed to find refresh token');
    }
};

const updateRefreshToken = async (token, newToken, newExpiresAt) => {
    try {
        const result = await users.query(
            'UPDATE users.user_tokens SET refresh_token = $1, expires_at = $2 WHERE refresh_token = $3 RETURNING *',
            [newToken, newExpiresAt, token]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating refresh token:', error.message);
        throw new Error('Failed to update refresh token');
    }
};

const deleteRefreshToken = async (token) => {
    try {
        const result = await users.query(
            'DELETE FROM users.user_tokens WHERE refresh_token = $1',
            [token]
        );
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error deleting refresh token:', error.message);
        throw new Error('Failed to delete refresh token');
    }
};

module.exports = {
    getRefreshToken,
    createRefreshToken,
    findRefreshToken,
    updateRefreshToken,
    deleteRefreshToken
};
