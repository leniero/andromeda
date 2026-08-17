import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EmotionForm.module.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

const EmotionForm = ({ setEmotion, onEmotionSubmitted }) => {
  const [emotion, setLocalEmotion] = useState('');
  const [textInput, setTextInput] = useState('');
  const [emoji, setEmoji] = useState('😶'); // Default emoji
  const navigate = useNavigate();

  const emotionEmojis = {
    Anger: '😡',
    Contempt: '😒',
    Disgust: '🤢',
    Envy: '😐',
    Guilt: '😣',
    Shame: '😳',
    Fear: '😨',
    Sadness: '😢',
    Surprise: '😲',
    Interest: '🧐',
    Hope: '🙂',
    Relief: '😮‍💨',
    Satisfaction: '😊',
    Joy: '😆',
    Elation: '😌',
    Pride: '🥹',
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--emotion-color', 'black');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const { coords } = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, (error) => {
          console.error('Geolocation error:', error);
          alert('Geolocation error. Please ensure location services are enabled.');
          reject(error);
        })
      );

      const data = {
        emotion,
        text_input: textInput,
        latitude: coords.latitude,
        longitude: coords.longitude,
        local_time: new Date().toISOString(),
      };

      await axios.post(`${process.env.REACT_APP_API_URL}emotions/record_emotion`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onEmotionSubmitted(); // Trigger the submission handler in HomePage
    } catch (error) {
      console.error('Error submitting emotion:', error);
      alert(`Error submitting emotion: ${error.message}`);
    }
  };

  const handleEmotionChange = (event) => {
    const selectedEmotion = event.target.value;
    setLocalEmotion(selectedEmotion);
    setEmotion(selectedEmotion); // Ensure setEmotion is passed correctly
    setEmoji(emotionEmojis[selectedEmotion] || '😶'); // Update emoji
  };

  return (
    <div className={styles.formContainer}>
      <Header />
      <div className={styles.largeEmoji}>{emoji}</div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <select
            id="emotion"
            value={emotion}
            onChange={handleEmotionChange}
            className={styles.select}
            required
          >
            <option value=""> - select an emotion </option>
            {Object.keys(emotionEmojis).map((key) => (
              <option key={key} value={key}>{emotionEmojis[key]} {key}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <textarea
            id="text_input"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="I feel this way because..."
            className={styles.textarea}
            rows="3"
            required
          />
        </div>
        <button type="submit" className={styles.button}>Log emotion</button>
      </form>
    </div>
  );
};

export default EmotionForm;