// client/src/pages/Login.jsx
import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl w-full max-w-sm space-y-4 shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded font-semibold"
        >
          Login
        </button>

        <p className="text-center text-sm mt-2">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
