import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage/WelcomePage';
import LogEmotion from './components/LogEmotion/LogEmotion';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import MyAccount from './components/MyAccount/MyAccount';
import EmotionList from './components/EmotionList/EmotionList';
import ChangePassword from './components/ChangePassword/ChangePassword'; // Import the new component
import styles from './styles/App.module.css';
import './styles/Normalize.css';

function App() {
  const [emotion, setEmotion] = useState('');

  return (
    <Router>
      <div className={styles.appContainer}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/log-emotion" element={<LogEmotion emotion={emotion} setEmotion={setEmotion} />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/emotion-list" element={<EmotionList />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/my-account" element={<PrivateRoute />}>
            <Route path="/my-account" element={<MyAccount />} />
          </Route>
          <Route path="/change-password" element={<PrivateRoute />}>
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;