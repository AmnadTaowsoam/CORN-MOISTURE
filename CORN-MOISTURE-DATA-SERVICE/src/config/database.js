// config/database.js
const { Pool } = require('pg');
require('dotenv').config(); // โหลดค่าจาก .env

// สร้างการเชื่อมต่อกับฐานข้อมูล
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
