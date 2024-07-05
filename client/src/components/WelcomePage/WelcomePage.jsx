import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';
import banner from './banner.png';

const WelcomePage = () => {
  return (
    <div className={styles.container}>
      <h1>Hey hey!</h1>
      <p>Let's get you started on Andromeda.</p>
      <img src={banner} alt="banner" className={styles.image} />
      <Link to="/login" className={styles.button}>Login</Link>
      <Link to="/signup" className={styles.buttonSecondary}>Sign up</Link>
    </div>
  );
};

export default WelcomePage;