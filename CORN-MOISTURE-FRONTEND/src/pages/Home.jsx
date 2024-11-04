import React, { useState } from "react";
import CornMoistureChartRecharts from '../components/CornMoistureChartRecharts';
import { fetchPredictionByQueue } from '../services/dataService';
import { startDataCollection } from '../services/moistureSensorService';

const Home = () => {
  const [queue, setQueue] = useState('');
  const [chartData, setChartData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันส่ง `queue` ไปที่ `moistureSensorService` เพื่อเริ่มเก็บข้อมูล
  const handleStartDataCollection = async () => {
    try {
      await startDataCollection(queue);
      console.log("Data collection started for Queue:", queue);

      // ตั้ง `setTimeout` เพื่อหน่วงเวลา 10 วินาทีก่อนดึงข้อมูล
      setTimeout(() => {
        handleFetchData(); // ดึงข้อมูลหลังจากรอ 10 วินาที
      }, 10000); // 10 วินาที
    } catch (error) {
      console.error("Error starting data collection:", error);
    }
  };

  // ฟังก์ชันดึงข้อมูลจากฐานข้อมูลโดยใช้ `fetchPredictionByQueue`
  const handleFetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchPredictionByQueue(queue);
      if (data.length > 0 && data[0].predictions) {
        const formattedData = data[0].predictions.map((item) => ({
          id: item.id,
          prediction: item.prediction,
        }));
        setChartData(formattedData);
        setStatistics(data[0].statistics);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page px-4 sm:px-6 lg:px-8 mt-6">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-purple-600">Moisture Real Time Data</h2>
      
      <div className="flex justify-center items-center mb-8">
        <input
          type="text"
          placeholder="Enter Queue ID"
          value={queue}
          onChange={(e) => setQueue(e.target.value)}
          className="w-1/3 p-3 rounded-l-lg focus:outline-none text-gray-800 border border-gray-300 shadow-md mr-2"
        />
        <button
          onClick={handleStartDataCollection} // เรียกใช้ handleStartDataCollection เมื่อกดปุ่ม
          className="p-3 bg-yellow-500 text-white font-semibold rounded-r-lg hover:bg-yellow-600 focus:outline-none shadow-md transition duration-300"
        >
          Start Data Collection
        </button>
      </div>

      <CornMoistureChartRecharts 
        chartData={chartData} 
        queue={queue} 
        statistics={statistics} 
        loading={loading} 
      />
    </div>
  );
};

export default Home;
