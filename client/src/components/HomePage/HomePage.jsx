import React, { useEffect, useState, useRef } from 'react';
import EmotionSpheres from '../EmotionSpheres/EmotionSpheres';
import TextOverlay from '../TextOverlay/TextOverlay';
import RingNavigation from '../RingNavigation/RingNavigation';
import axios from 'axios';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [emotionsData, setEmotionsData] = useState([]);
  const [error, setError] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [showText, setShowText] = useState(true);
  const [isBlurred, setIsBlurred] = useState(false);
  const textMeshRef = useRef([]);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User is not logged in.');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}emotions/get_emotions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmotionsData(response.data);
      } catch (error) {
        setError('Error fetching emotions data.');
        console.error('Error fetching emotions:', error);
      }
    };
    fetchEmotions();
  }, []);

  return (
    <div className={styles.visualizationPage}>
      {error && <div className={styles.error}>Failed to load emotions data: {error}</div>}
      {!error && (
        <div className={`${styles.visualizationContainer} ${isBlurred ? styles.blurred : ''}`}>
          <EmotionSpheres
            emotionsData={emotionsData}
            width={window.innerWidth}
            height={window.innerHeight}
            setScene={setScene}
            setCamera={setCamera}
            textMeshRef={textMeshRef}
          />
          {showText && scene && camera && (
            <TextOverlay emotionsData={emotionsData} scene={scene} camera={camera} textMeshRef={textMeshRef} />
          )}
        </div>
      )}
      <div className={styles.toggleButtonContainer}>
        <button className={styles.toggleButton} onClick={() => setShowText(prev => !prev)}>
          {showText ? 'Hide text' : 'Show text'}
        </button>
      </div>
      <RingNavigation setIsBlurred={setIsBlurred} />
    </div>
  );
};

export default HomePage;