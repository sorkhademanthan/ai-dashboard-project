import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // ✅ backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
