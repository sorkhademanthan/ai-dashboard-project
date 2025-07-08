import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="bg-white/10 text-white flex justify-between items-center px-8 py-4 shadow-md backdrop-blur-lg">
      <h1 className="text-xl font-bold">Welcome, Wizard 🧙‍♂️</h1>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white font-medium transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
