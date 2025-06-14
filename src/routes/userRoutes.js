import express from "express";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../controller/userController.js";
import { authenticateUser } from "../middleware/authGuard.js";
import { getUserProfile } from "../controller/authController.js";
// import Router from 'express';

const router= express.Router();

//CRUD

router.get("/profile", authenticateUser, getUserProfile);
router.get("/user", getAllUsers);
router.get("/getSingleUser/:user_id", getUserById);
router.patch("/updateUser/:user_id", updateUser);
router.delete("/deleteUser/:user_id", deleteUser);

export default router;
