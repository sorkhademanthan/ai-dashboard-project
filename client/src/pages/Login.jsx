import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', form);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-white text-center">Login 🔐</h2>
        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:brightness-110 transition"
        >
          Login
        </button>
        <p className="text-center text-sm text-gray-400">
          Don’t have an account? <span className="underline cursor-pointer text-indigo-400" onClick={() => navigate('/register')}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
