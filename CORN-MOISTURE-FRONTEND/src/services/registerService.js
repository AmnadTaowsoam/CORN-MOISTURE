import axios from 'axios';

// ดึงค่าจาก .env
const API_USER_URL = import.meta.env.VITE_REACT_APP_USER_ENDPOINT;

const registerService = async (userData) => {
  try {
    const response = await axios.post(`${API_USER_URL}/v1/register`, userData);
    return response.data; // Return ข้อมูล response จาก backend
  } catch (error) {
    console.error("Error during registration:", error.response ? error.response.data : error.message);
    throw error; // ส่งต่อ error เพื่อให้ component ที่เรียกใช้งานจัดการ
  }
};

export default registerService;
