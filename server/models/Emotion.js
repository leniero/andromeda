// EmotionForm.js

const mongoose = require('mongoose');

const emotionSchema = new mongoose.Schema({
    emotion: String,
    text_input: String,
    latitude: Number,
    longitude: Number,
    local_time: Date,
});

module.exports = mongoose.model('Emotion', emotionSchema);