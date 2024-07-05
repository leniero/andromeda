// emotionRoutes.js

const express = require('express');
const emotionController = require('../controllers/emotionController');

const router = express.Router();

router.get('/get_emotions', emotionController.getEmotions);
router.post('/record_emotion', emotionController.recordEmotion);

module.exports = router;