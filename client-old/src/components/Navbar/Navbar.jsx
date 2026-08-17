// Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link className={styles.navLink} to="/">Home</Link>
        <Link className={styles.navLink} to="/ecloud">eCloud</Link>
        {!isAuthenticated && (
          <>
            <Link className={styles.navLink} to="/login">Login</Link>
            <Link className={styles.navLink} to="/signup">Sign Up</Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link className={styles.navLink} to="/dashboard">Dashboard</Link>
            <button className={styles.navButton} onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;