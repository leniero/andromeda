import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = () => {
    const currentPath = location.pathname;
    return currentPath !== '/home' && currentPath !== '/';
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <header className={styles.header}>
      {showBackButton() && (
        <button className={styles.backButton} onClick={handleBackClick}>
          Back
        </button>
      )}
    </header>
  );
};

export default Header;