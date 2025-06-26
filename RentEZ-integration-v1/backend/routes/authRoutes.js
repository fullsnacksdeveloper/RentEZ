const express = require("express");

const {
  createUser,
  loginUser,
  createAdmin,
  getUserProfile
} = require("../controllers/authController");

const {
  isAdmin,
  verifyToken
} = require("../middleware/verify");

const router = express.Router();

// Auth-related routes
router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/create-admin', verifyToken, isAdmin, createAdmin);
//router.get('/profile', verifyToken, getUserProfile);
router.get('/me', verifyToken, getUserProfile); // ✅ Add this alias

module.exports = router;
