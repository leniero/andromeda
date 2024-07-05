import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RingNavigation.module.css';

const RingNavigation = ({ setIsBlurred }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsBlurred(!isOpen); // This will set the blur state in the parent component
  };

  return (
    <div className={styles.navContainer}>
      <div 
        className={`${styles.circleButton} ${styles.mainButton}`} 
        onClick={toggleMenu}
      >
        {isOpen ? 'X' : ''}
      </div>
      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.circleButton} onClick={() => navigate('/emotion-list')}>LIST</div>
          <div className={styles.circleButton} onClick={() => navigate('/my-account')}>ME</div>
          <div className={styles.circleButton} onClick={() => navigate('/log-emotion')}>LOG</div>
        </div>
      )}
    </div>
  );
};

export default RingNavigation;