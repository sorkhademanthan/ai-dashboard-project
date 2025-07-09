// client/src/pages/Register.jsx
import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form); // ✅ fixed route
      // ✅ Register endpoint
      localStorage.setItem('token', ''); // Clear token on register
      // ✅ Clear token after registration
      alert('Registered successfully!');
      navigate('/');
    } catch (err) {
      console.error('Register error:', err);
      alert(err.response?.data?.message || 'Error registering');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl w-full max-w-sm space-y-4 shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          required
          autoComplete="name"
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          required
          autoComplete="email"
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          required
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded font-semibold"
        >
          Register
        </button>

        {/* Link to login */}
        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link
            to="/"
            className="text-indigo-400 hover:underline hover:text-indigo-300"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
