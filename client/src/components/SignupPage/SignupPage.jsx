import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/authService'; // Corrected path
import styles from './SignupPage.module.css';
import Header from '../Header/Header';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(username, email, password);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <h2 className={styles.heading}>Sign Up</h2>
      <form onSubmit={handleSignup} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;