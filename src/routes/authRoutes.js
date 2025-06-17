import express from "express";

import { 
    createUser, 
    loginUser, 
    createAdmin,
    getUserProfile,
    changePassword,
} from '../controller/authController.js';

import { protect } from "../middleware/authGuard.js";

import {  
    isAdmin, 
    verifyToken
} from '../middleware/verify.js';



const router= express.Router();


//CRUD

router.post('/register', createUser);
router.post('/login', loginUser);
// router.post('/create-admin', createAdmin);
router.post('/create-admin', verifyToken, isAdmin, createAdmin);
router.get('/profile', verifyToken, getUserProfile);
router.patch('/change-password', protect, changePassword);




export default router;