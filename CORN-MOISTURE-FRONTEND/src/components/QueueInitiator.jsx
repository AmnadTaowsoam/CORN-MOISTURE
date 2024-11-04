// components/QueueInitiator.jsx
import React, { useState } from 'react';
import { startDataCollection } from '../services/moistureSensorService';
import { fetchPredictionByQueue } from '../services/dataService';

const QueueInitiator = ({ onFetchData }) => {
  const [queue, setQueue] = useState('');

  const handleInputChange = (e) => {
    setQueue(e.target.value);
  };

  const handleStartCollection = async () => {
    if (!queue) {
      console.error("Queue ID is missing");
      return;
    }

    try {
      await startDataCollection(queue);
      console.log("Data collection started for Queue:", queue);
    } catch (error) {
      console.error("Error starting data collection:", error);
    }
  };

  const handleFetchData = async () => {
    if (!queue) {
      console.error("Queue ID is missing");
      return;
    }

    try {
      const data = await fetchPredictionByQueue(queue);
      onFetchData(data); // ส่งข้อมูลไปยังฟังก์ชันเพื่อแสดงกราฟ
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="text-center">
      <input
        type="text"
        value={queue}
        onChange={handleInputChange}
        className="p-2 border rounded mt-2"
        placeholder="Queue ID"
      />
      <div className="flex justify-center mt-2 gap-2">
        <button onClick={handleStartCollection} className="p-2 bg-green-500 text-white rounded">Start Data Collection</button>
        <button onClick={handleFetchData} className="p-2 bg-yellow-400 text-gray-800 rounded">Fetch Data</button>
      </div>
    </div>
  );
};

export default QueueInitiator;
