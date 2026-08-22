// routes/authRoutes.js
const express = require('express');
const { signup, loginUser, getCurrentUser, changePassword, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', loginUser);
router.get('/me', auth.required, getCurrentUser);
router.post('/change-password', auth.required, changePassword);

// New Routes
router.post('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;