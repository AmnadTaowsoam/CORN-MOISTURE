import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { login } from '../services/loginService';

function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(username, password);
      console.log('Login successful:', result);
      onLogin(); // เรียกฟังก์ชัน onLogin เมื่อล็อกอินสำเร็จ
      onClose();
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-60">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Full name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </span>
              <input 
                type="text" 
                className="input input-bordered w-full pl-10" 
                placeholder="Enter your full name" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400" />
              </span>
              <input 
                type="password" 
                className="input input-bordered w-full pl-10" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">Sign In</button>
          </div>
        </form>
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">&times;</button>
      </div>
    </div>
  );
}

export default LoginModal;
