import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import registerService from '../services/registerService'; // Import registerService

function RegisterModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: 'superuser',
    port: 9000
  });

  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerService(formData);
      console.log("Registration successful:", response);
      onClose(); // ปิด modal เมื่อสำเร็จ
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Registration failed');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"> 
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-60">
        <div className='text-center'>
          <h2 className="text-2xl font-bold mb-4">Create a new account</h2>
          <h4 className="text-sm mb-4">Enter your details to register</h4>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Full name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </span>
              <input
                type="text"
                name="username"
                className="input input-bordered w-full pl-10"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaEnvelope className="text-gray-400" />
              </span>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full pl-10"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                className="input input-bordered w-full pl-10"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Roles</label>
              <input
                type="text"
                name="roles"
                className="input input-bordered w-full"
                placeholder="Enter your role"
                value={formData.roles}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Port</label>
              <input
                type="number"
                name="port"
                className="input input-bordered w-full"
                placeholder="Enter port number"
                value={formData.port}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">&times;</button>
      </div>
    </div>
  );
}

export default RegisterModal;
