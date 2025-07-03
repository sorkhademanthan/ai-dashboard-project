import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  // Logout clears token and redirects to login
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Test button: Adds a dummy prompt/response
  const createDummyPrompt = async () => {
    try {
      const res = await axios.post('/ai/history', {
        prompt: 'What is AI?',
        response: 'AI stands for Artificial Intelligence.',
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Dummy prompt added!');
      setHistory(prev => [...prev, res.data]); // Update UI immediately
    } catch (err) {
      console.error('Error creating prompt:', err);
      alert('Failed to create dummy prompt.');
    }
  };

  // Fetch history on page load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/ai/history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
        alert('Failed to load history');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    };

    fetchHistory();
  }, [navigate]);

  return (
    <div className="p-6 text-white min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-400 drop-shadow-md">🧙‍♂️ Prompt Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={createDummyPrompt}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-all shadow-md"
          >
            + Add Dummy Prompt
          </button>
          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-all shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      {history.length === 0 ? (
        <p className="text-gray-400 italic">No data found.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((item) => (
            <li
              key={item._id}
              className="bg-white/10 p-5 rounded-xl border border-white/10 shadow hover:shadow-xl transition-all"
            >
              <p className="text-sm text-pink-300 mb-1">Prompt:</p>
              <p className="text-white/90 mb-3">{item.prompt}</p>
              <p className="text-sm text-green-300 mb-1">Response:</p>
              <p className="text-white/80">{item.response}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
