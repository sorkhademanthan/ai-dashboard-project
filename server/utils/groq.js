import axios from 'axios';

const groqAPI = axios.create({
  baseURL: 'https://api.groq.com/openai/v1', // ✅ DO NOT include /chat/completions here
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export default groqAPI;
