// emotionRoutes.js

const express = require('express');
const router = express.Router();
const Emotion = require('../models/Emotion');
const UserEmotion = require('../models/UserEmotion');
const User = require('../models/User');
const auth = require('../middleware/auth'); // Middleware to check authentication

// Submit an emotion (accessible to both logged-in and non-logged-in users)
router.post('/submit', auth.optional, async (req, res) => {
  try {
    const { emotion, text_input, latitude, longitude } = req.body;

    let username = undefined;
    if (req.user) {
      const userDoc = await User.findById(req.user._id);
      if (userDoc) {
        username = userDoc.username;
      }
    }

    // Save to the collective emotions collection
    const newEmotion = new Emotion({
      username,
      emotion,
      text_input,
      latitude,
      longitude,
      local_time: new Date()
    });
    await newEmotion.save();

    // If the user is logged in, save to their private emotions collection
    if (req.user) {
      const userEmotion = new UserEmotion({
        userId: req.user._id,
        emotion,
        text_input,
        latitude,
        longitude,
        local_time: new Date()
      });
      await userEmotion.save();
    }

    res.status(201).json({ message: 'Emotion submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all public emotions (accessible to everyone)
router.get('/get_emotions', async (req, res) => {
  try {
    const emotions = await Emotion.find().sort({ local_time: -1 });
    res.status(200).json(emotions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get logged-in user's emotions (accessible only to logged-in users)
router.get('/get_user_emotions', auth.required, async (req, res) => {
  try {
    const userEmotions = await UserEmotion.find({ userId: req.user._id }).sort({ local_time: -1 });
    res.status(200).json(userEmotions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an emotion entry
router.delete('/:id', auth.required, async (req, res) => {
  try {
    const userEmotion = await UserEmotion.findOne({ _id: req.params.id, userId: req.user._id });
    if (!userEmotion) {
      return res.status(404).json({ error: 'Emotion not found' });
    }
    
    // Find and delete the corresponding public Emotion
    await Emotion.findOneAndDelete({
      emotion: userEmotion.emotion,
      text_input: userEmotion.text_input,
      latitude: userEmotion.latitude,
      longitude: userEmotion.longitude,
      local_time: userEmotion.local_time
    });

    await UserEmotion.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Emotion deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;