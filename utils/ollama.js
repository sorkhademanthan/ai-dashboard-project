import axios from 'axios';

const ollama = axios.create({
  baseURL: 'http://localhost:11434', // Ollama default server
  headers: {
    'Content-Type': 'application/json',
  },
});

export default ollama;
