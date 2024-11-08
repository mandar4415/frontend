import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear token
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="w-3/5 mx-auto">
      <nav className="bg-gray-800 bg-opacity-70 p-4 flex justify-between items-center rounded-2xl shadow-lg">
        <div className="text-2xl font-bold text-gray-100">
          Welcome to the inventory
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
