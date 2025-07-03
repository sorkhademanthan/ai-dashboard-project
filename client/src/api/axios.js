// client/src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/users', // 👈 Sets default base URL for user routes
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
