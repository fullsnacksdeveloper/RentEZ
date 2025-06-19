// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const { getAdminStats } = require('../controllers/adminController');
const {authenticateUser} = require('../middleware/authGuard');
const isAdmin = require('../middleware/isAdmin');

// GET /api/admin/stats → returns property count + pending count
router.get('/stats', authenticateUser, isAdmin, getAdminStats);

module.exports = router;
