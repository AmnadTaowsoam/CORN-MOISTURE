const { users } = require('../config/dbconfig');
const bcrypt = require('bcryptjs');

async function getUserByUsername(username) {
    console.log(`Fetching user from DB: ${username}`);
    const query = "SELECT * FROM users.users WHERE username = $1";
    const values = [username];
    try {
      const res = await users.query(query, values);
      return res.rows[0];
    } catch (error) {
      console.error("Error fetching user from database:", error);
      throw error;
    }
}

async function createUser({ username, password, email, roles, port }) {
    console.log(`Creating user: ${username}`);

    const query =
      "INSERT INTO users.users (username, pwd, email, roles, port) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
    const values = [username, password, email, roles, port]; // Use the hashed password directly
    const res = await users.query(query, values);
    return res.rows[0];
}

  
async function updateUser(username, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
  
    const query =
      "UPDATE users.users SET pwd = $2 WHERE username = $1 RETURNING *";
    const values = [username, hashedPassword];
    const res = await users.query(query, values);
    console.log("UserId =", res.rows[0]);
    return res.rows[0];
}
  
async function findUserByUsername(username) {
    const query = "SELECT * FROM users.users WHERE username = $1";
    const values = [username];
    try {
      const res = await users.query(query, values);
      return res.rows[0];
    } catch (error) {
      console.error("Error fetching user from database:", error);
      throw error;
    }
}
  
async function findUserById(userId) {
    const query = "SELECT * FROM users.users WHERE user_id = $1";
    const values = [userId];
    try {
      const res = await users.query(query, values);
      return res.rows[0]; // Return the first row (user object) or undefined if not found
    } catch (error) {
      console.error("Error fetching user by ID from database:", error);
      throw error;
    }
}
  
async function deleteUser(userId) {
    const query = "DELETE FROM users.users WHERE user_id = $1 RETURNING *";
    const values = [userId];
    const res = await users.query(query, values);
    if (res.rows.length === 0) {
      throw new Error("User not found");
    }
    return res.rows[0]; // Or just return res.rowCount for the number of rows affected
}

async function getAllUsers() {
    const query = "SELECT * FROM users.users";
    try {
      const res = await users.query(query);
      return res.rows; // This will return an array of user objects
    } catch (error) {
      console.error("Error fetching all users from database:", error);
      throw error;
    }
}

module.exports = {
    getUserByUsername,
    findUserByUsername,
    findUserById,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers
};
