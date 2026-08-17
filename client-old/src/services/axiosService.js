// axiosService.js
import axios from 'axios';

// Use the environment variable to get the API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:5001';

const instance = axios.create({
  baseURL: API_URL,
});

export default instance;