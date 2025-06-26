const {
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService
} = require("../models/userModel");

const { handleResponse } = require("../utils/handleResponse");

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    handleResponse(res, 200, "Users retrieved successfully", users);
  } catch (err) {
    next(err);
  }
};

// Get single user by ID
const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return handleResponse(res, 404, "User does not exist.");
    handleResponse(res, 200, "User retrieved successfully", user);
  } catch (err) {
    next(err);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  const { email } = req.body;
  try {
    const updatedUser = await updateUserService(req.params.id, email);
    if (!updatedUser) return handleResponse(res, 404, "User does not exist.");
    handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id);
    if (!deletedUser) return handleResponse(res, 404, "User does not exist.");
    handleResponse(res, 200, "User deleted successfully", deletedUser);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
