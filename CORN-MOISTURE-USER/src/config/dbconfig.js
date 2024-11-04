const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); // Adjust the path as necessary based on actual file structure

/**
 * Fetches database configuration from environment variables using a specified prefix.
 * @param {string} prefix The prefix for the environment variables (e.g., 'USERS').
 * @returns {Object} Database configuration object.
 */
function getDbConfig(prefix) {
    const config = {
        host: process.env[`${prefix}_DB_HOST`],
        user: process.env[`${prefix}_DB_USERNAME`],
        password: process.env[`${prefix}_DB_PASSWORD`],
        database: process.env[`${prefix}_DB_NAME`],
        port: parseInt(process.env[`${prefix}_DB_PORT`], 10),
    };

    const missingVars = Object.entries(config)
        .filter(([, value]) => !value)
        .map(([key]) => `${prefix}_${key.toUpperCase()}`);

    if (missingVars.length > 0) {
        console.error(`Environment variables: ${JSON.stringify(process.env, null, 2)}`);
        throw new Error(`Database configuration error: Missing environment variables [${missingVars.join(', ')}] for the ${prefix} database.`);
    }

    return config;
}

// Create database pools for different databases if necessary
const users = new Pool(getDbConfig('USERS'));

module.exports = { users };
