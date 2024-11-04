const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const predictionRoutes = require('./routes/predictionRoutes');
const errorHandler = require('./middleware/errorHandler');
const authenticateAPIKey = require('./middleware/authenticateAPIKey');
require('dotenv').config();

const app = express();

// ใช้ middleware ที่จำเป็น
app.use(cors()); // เปิดการใช้งาน CORS เพื่ออนุญาตให้เข้าถึงจากต้นทางอื่น
app.use(helmet()); // ใช้ Helmet เพื่อเพิ่มความปลอดภัยให้กับ HTTP headers
app.use(morgan('combined')); // ใช้ Morgan ในการบันทึก log ของ request ต่างๆ
app.use(cookieParser()); // ใช้ cookie-parser เพื่อจัดการกับ cookies

// ตั้งค่า rate limiter เพื่อป้องกันการโจมตีด้วยการส่ง request จำนวนมาก
const limiter = rateLimit({
    windowMs: 1440 * 60 * 1000, // 15 นาที
    max: 1000, // จำกัด request ไว้ที่ 100 ครั้งต่อ windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

app.use(express.json());

// ใช้ authenticateAPIKey middleware กับเส้นทางที่ต้องการตรวจสอบ API key
app.use(authenticateAPIKey);

// กำหนดเส้นทาง API โดยเพิ่ม version
app.use('/api/v1', predictionRoutes); // ใช้ /api/v1 สำหรับ version ของ API

// เพิ่ม endpoint สำหรับ health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Healthy', message: 'The server is running correctly.' });
});

// ใช้ middleware สำหรับจัดการ error
app.use(errorHandler);

const PORT = process.env.DATA_SERVICE_PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
