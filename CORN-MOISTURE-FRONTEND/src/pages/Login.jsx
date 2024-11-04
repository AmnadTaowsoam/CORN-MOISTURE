import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { login } from '../services/loginService';
import { useNavigate, Link } from 'react-router-dom';  // เพิ่ม Link

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(username, password);

      if (result && result.accessToken) {
        console.log('Login successful');
        navigate('/');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">Welcome back</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </span>
              <input
                type="text"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400" />
              </span>
              <input
                type="password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
          <div className="flex justify-between items-center mb-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
            <Link to="/register" className="text-sm text-blue-600 hover:underline">
              Create an account
            </Link>
          </div>
        </form>
        <div className="text-center">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
