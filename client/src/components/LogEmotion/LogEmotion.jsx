import React, { useState, useEffect } from 'react';
import styles from './LogEmotion.module.css';
import EmotionForm from '../EmotionForm/EmotionForm';
import { useNavigate } from 'react-router-dom';

const emotionColors = {
    Anger: 'red',
    Contempt: 'orangered',
    Disgust: 'darkorange',
    Envy: 'gold',
    Guilt: 'yellow',
    Shame: 'yellowgreen',
    Fear: 'green',
    Sadness: 'lightseagreen',
    Surprise: 'skyblue',
    Interest: 'deepskyblue',
    Hope: 'dodgerblue',
    Relief: 'blue',
    Satisfaction: 'slateblue',
    Joy: 'mediumslateblue',
    Elation: 'mediumorchid',
    Pride: 'darkviolet'
};

const LogEmotion = ({ emotion, setEmotion }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationColor, setConfirmationColor] = useState('#000000');
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.style.setProperty('--emotion-color', emotionColors[emotion] || '#000000');
    }, [emotion]);

    const handleEmotionSubmitted = () => {
        setConfirmationColor(emotionColors[emotion] || '#000000');
        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
            document.documentElement.style.setProperty('--emotion-color', 'black');
            navigate('/home');
        }, 3000); // Show the confirmation for 3 seconds
    };

    useEffect(() => {
        return () => {
            document.documentElement.style.setProperty('--emotion-color', 'black');
        };
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--emotion-color', 'black');
    }, []);

    return (
        <div className={styles.container}>
            {showConfirmation ? (
                <div className={styles.confirmationContainer}>
                    <div className={styles.circle} style={{ backgroundColor: confirmationColor }}></div>
                    <p className={styles.confirmationText}>It's Out!</p>
                </div>
            ) : (
                <EmotionForm setEmotion={setEmotion} onEmotionSubmitted={handleEmotionSubmitted} />
            )}
        </div>
    );
};

export default LogEmotion;