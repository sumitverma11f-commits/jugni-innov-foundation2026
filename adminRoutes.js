const express = require('express');
const rateLimit = require('express-rate-limit');
const { loginAdmin, getDashboardStats } = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' }
});

router.post('/login', loginLimiter, loginAdmin);
router.get('/stats', verifyToken, getDashboardStats);

module.exports = router;
