import React, { useState, useEffect, useRef } from 'react';
import { FaRegUserCircle, FaChevronDown } from 'react-icons/fa';
import { logout } from '../services/logoutService';
import { startUpdate } from '../services/updateService'; // Import the update function

function Header({ onLoginClick, onRegisterClick, onLogoutClick, username }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogoutClick = () => {
    logout(); // Clear data on logout
    window.location.reload(); // Reload to reset the state
  };

  const handleUpdateClick = async () => {
    try {
      setUpdateStatus('Updating...');
      const result = await startUpdate(import.meta.env.VITE_REACT_APP_UPDATE_SERVICE_ENDPOINT || 'http://localhost:5763');
      setUpdateStatus(result);
    } catch (error) {
      setUpdateStatus(`Error starting update: ${error.message}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false); // Close menu if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-primary text-white shadow-lg relative z-20">
      <div className="flex-1 flex justify-start items-center">
        <h1 className="text-2xl font-bold ml-4">BETAGRO CO.,LTD</h1>
      </div>

      <div className="relative" ref={menuRef}>
        <button 
          onClick={toggleMenu} 
          className="flex items-center space-x-2 focus:outline-none"
        >
          <FaRegUserCircle size={30} />
          <span>{username}</span>
          <FaChevronDown size={14} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg z-30">
            <ul>
              <li>
                <button 
                  onClick={() => onLoginClick()} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onRegisterClick()} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Register
                </button>
              </li>
              <li>
                <button 
                  onClick={handleLogoutClick} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </li>
              <li>
                <button 
                  onClick={handleUpdateClick} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Update System
                </button>
              </li>
            </ul>
            {updateStatus && <p className="text-center mt-2 text-sm text-gray-500">{updateStatus}</p>}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
