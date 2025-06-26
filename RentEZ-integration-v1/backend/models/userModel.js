const pool = require('../db');

// Get all users
const getAllUsersService = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

// Get a user by ID
const getUserByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
  return result.rows[0];
};

// Update user
const updateUserService = async (id, email) => {
  const result = await pool.query(
    "UPDATE users SET email = $1 WHERE user_id = $2 RETURNING *",
    [email, id]
  );
  return result.rows[0];
};

// Delete user
const deleteUserService = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE user_id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService
};
