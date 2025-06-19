const express = require("express");

const {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser
} = require("../controllers/userController");

const { authenticateUser } = require("../middleware/authGuard");

const { getUserProfile } = require("../controllers/authController");

const router = express.Router();

// Routes
router.get("/profile", authenticateUser, getUserProfile);
router.get("/user", getAllUsers);
router.get("/getSingleUser/:user_id", getUserById);
router.patch("/updateUser/:user_id", updateUser);
router.delete("/deleteUser/:user_id", deleteUser);




module.exports = router;
