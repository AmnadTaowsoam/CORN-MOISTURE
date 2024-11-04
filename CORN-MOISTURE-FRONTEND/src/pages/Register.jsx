import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import registerService from '../services/registerService';
import { useNavigate, Link } from 'react-router-dom';  // นำเข้า useNavigate และ Link

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: 'guest',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');  // เพิ่มข้อความแสดงผลสำเร็จ
  const navigate = useNavigate();  // สร้าง navigate เพื่อใช้ในการเปลี่ยนหน้า

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
      setSuccessMessage("Registration successful! Redirecting to login...");  // เพิ่มข้อความแสดงผลสำเร็จ

      // รอ 2 วินาทีก่อนเปลี่ยนหน้าไปยังหน้าล็อกอิน
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <div className='text-center'>
          <h2 className="text-2xl font-bold mb-4">Create a new account</h2>
          <h4 className="text-sm mb-4">Enter your details to register</h4>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}  {/* แสดงข้อความแสดงผลสำเร็จ */}
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Roles</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUserTag className="text-gray-400" />
              </span>
              <input
                type="text"
                name="roles"
                className="input input-bordered w-full pl-10"
                placeholder="Enter your role"
                value={formData.roles}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
        <div className="text-center mt-4">
          {/* เพิ่มลิงก์สำหรับผู้ใช้ที่มีบัญชีอยู่แล้ว */}
          <Link to="/login" className="text-blue-600 hover:underline">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
