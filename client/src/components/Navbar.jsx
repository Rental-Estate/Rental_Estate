import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaComments } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // From context

  useEffect(() => {
    const root = window.document.documentElement;
    darkMode ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    logout(); // Clears user from context
    navigate("/"); // Redirect to homepage
  };

  

  return (
    <header className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/rentallogo.png" 
            alt="RentalEstate Logo" 
            className="h-20 w-auto dark:invert"
          />
        </Link>

        

        <nav className="hidden md:flex space-x-6 text-gray-700 dark:text-gray-100 font-medium">
  <Link to="/" className="hover:text-red-500">Home</Link>
  <Link to="/browse" className="hover:text-red-500">Browse</Link>

  {user?.role === 'owner' && (
    <>
      <Link to="/list-property" className="hover:text-red-500">List Your Property</Link>
      <Link to="/Owner" className="hover:text-red-500">Owner Dashboard</Link>
      

    </>
  )}

  

  {user?.role === 'admin' && (
    <Link to="/admin-dashboard" className="hover:text-red-500">Admin Panel</Link>
  )}
</nav>


        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl px-2"
            title="Toggle Dark Mode"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {!user ? (
  <Link to="/login">
    <motion.button
      whileHover={{ scale: 1.05 }}
      className="text-secondary dark:text-white font-semibold"
    >
      Login
    </motion.button>
  </Link>
) : (
  <div className="flex items-center gap-2">
    <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-2 py-1 rounded">
      {user.role?.toUpperCase()}
    </span>
    <motion.button
      whileHover={{ scale: 1.05 }}
      onClick={handleLogout}
      className="text-sm px-4 py-2 bg-red-500 text-white rounded-lg"
    >
      Logout
    </motion.button>
  </div>

  
)}



{user && (
  <>
    <Link
      to="/chat"
      className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-white hover:text-blue-600 transition"
    >
      <FaComments />
      <span className="hidden md:inline">Chat</span>
    </Link>

    
  </>
)}


        </div>
      </div>
    </header>
  );
};

export default Navbar;