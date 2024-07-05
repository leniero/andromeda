import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EmotionList.module.css';
import Header from '../Header/Header';

const EmotionList = () => {
  const [emotions, setEmotions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}emotions/get_emotions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedEmotions = response.data.sort((a, b) => new Date(b.local_time) - new Date(a.local_time));
        setEmotions(sortedEmotions);
      } catch (error) {
        console.error('Error fetching emotions:', error);
        setError(error);
      }
    };

    fetchEmotions();
  }, []);

  const emotionColors = {
    Anger: 'red', Contempt: 'orangered', Disgust: 'darkorange', Envy: 'gold',
    Guilt: 'yellow', Shame: 'yellowgreen', Fear: 'green', Sadness: 'lightseagreen',
    Surprise: 'skyblue', Interest: 'deepskyblue', Hope: 'dodgerblue',
    Relief: 'blue', Satisfaction: 'slateblue', Joy: 'mediumslateblue', Elation: 'mediumorchid',
    Pride: 'darkviolet'
  };

  const emotionEmojis = {
    Anger: '😡', Contempt: '😒', Disgust: '🤢', Envy: '😐',
    Guilt: '😣', Shame: '😳', Fear: '😨', Sadness: '😢',
    Surprise: '😲', Interest: '🧐', Hope: '🙂', Relief: '😮‍💨',
    Satisfaction: '😊', Joy: '😆', Elation: '😌', Pride: '🥹'
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <Header />
        {error && <p className={styles.error}>Error fetching emotions</p>}
        <ul className={styles.emotionList}>
          {emotions.map((emotion) => (
            <li key={emotion._id} className={styles.emotionItem}>
              <div className={styles.circle} style={{ backgroundColor: emotionColors[emotion.emotion] || 'gray' }}>
                <span className={styles.emoji}>{emotionEmojis[emotion.emotion] || '😶'}</span>
              </div>
              <div className={styles.textContainer}>
                <span className={styles.text}>{emotion.text_input}</span>
              </div>
              <span className={styles.date}>{formatDate(emotion.local_time)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmotionList;