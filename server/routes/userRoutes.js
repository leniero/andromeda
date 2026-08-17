// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/me', auth.required, userController.getCurrentUser);
router.get('/:id', userController.getUser);
router.put('/:id', auth.required, userController.updateUser);
router.delete('/:id', auth.required, userController.deleteUser);
router.put('/change_password', auth.required, userController.changePassword);

module.exports = router;