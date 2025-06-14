import express from "express";
// import Router from 'express';

import { 
    createUser, 
    loginUser, 
    createAdmin,
    getUserProfile,
} from '../controller/authController.js';

import {  
    isAdmin, 
    verifyToken
} from '../middleware/verify.js';



const router= express.Router();


//CRUD

router.post('/auth/register', createUser);
router.post('/auth/login', loginUser);
router.post('/auth/create-admin', verifyToken, isAdmin, createAdmin);
router.get('/auth/profile', verifyToken, getUserProfile);



export default router;