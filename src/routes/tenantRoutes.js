import express from 'express';


import { 
    getTenantProfile, 
    updateTenantProfile 
} from '../controller/tenantController.js';

import { verifyToken } from '../middleware/verify.js'; 

const router = express.Router();

router.get('/getProfile/:id', verifyToken, getTenantProfile);
router.put('/updateProfile/:id', verifyToken, updateTenantProfile);

export default router;
