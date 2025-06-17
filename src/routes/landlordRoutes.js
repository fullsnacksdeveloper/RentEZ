import express from 'express';
import { 
    getLandlordProfile, 
    updateLandlordProfile 
} from '../controller/landlordController.js';

import { verifyToken } from '../middleware/verify.js';

const router = express.Router();

router.get('/landlordProfile/:id', verifyToken, getLandlordProfile);
router.put('updateLandlord/:id', verifyToken, updateLandlordProfile);

export default router;
