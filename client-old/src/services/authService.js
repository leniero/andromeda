// authService.js
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/';

export const login = async (email, password) => {
  return axios.post(`${apiUrl}auth/login`, { email, password });
};

export const signup = async (username, email, password) => {
  return axios.post(`${apiUrl}auth/signup`, { username, email, password });
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};