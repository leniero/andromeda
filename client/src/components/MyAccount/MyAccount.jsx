import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosService';
import styles from './MyAccount.module.css';
import Header from '../Header/Header';

const MyAccount = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.heading}>My Account</h1>
      {userData ? (
        <div className={styles.userInfo}>
          <div className={styles.infoItem}>
            <label>Username:</label>
            <span className={styles.infoValue}>@{userData.username}</span>
          </div>
          <div className={styles.infoItem}>
            <label>Email:</label>
            <span className={styles.infoValue}>{userData.email}</span>
          </div>
          <button className={styles.buttonSecondary} onClick={handleChangePassword}>Change Password</button>
          <button className={styles.button} onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p className={styles.loading}>Loading...</p>
      )}
    </div>
  );
};

export default MyAccount;