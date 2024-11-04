// components/CornMoistureChart.js
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchPredictionByQueue } from '../services/dataService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CornMoistureChart = () => {
  const [queue, setQueue] = useState('');
  const [chartData, setChartData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchPredictionByQueue(queue);
      console.log("Fetched Data:", data);

      if (data.length > 0 && data[0].predictions) {
        const labels = data[0].predictions.map((item) => item.id);
        const values = data[0].predictions.map((item) => item.prediction);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Corn Moisture Predictions',
              data: values,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true,
            },
          ],
        });

        setStatistics(data[0].statistics);
      } else {
        setChartData(null);
        setStatistics(null);
        console.error('No predictions data available');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-10xl mx-auto my-4 p-6 bg-white shadow-lg rounded-lg"> {/* ขยายขนาด container */}
      <div className="text-center mb-6">
        <input
          type="text"
          placeholder="Enter Queue ID"
          value={queue}
          onChange={(e) => setQueue(e.target.value)}
          className=" w-1/4 p-2 border rounded-l-lg focus:outline-none mr-2"
        />
        <button
          onClick={handleFetchData}
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
        >
          Fetch Data
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading...</p>
      ) : (
        chartData ? (
          <>
            <div className="mb-8">
              <Line
                data={chartData}
                width={800} // เพิ่มความกว้างของกราฟ
                height={400} // เพิ่มความสูงของกราฟ
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // ปิด aspect ratio เพื่อปรับขนาดตามที่กำหนด
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: `Corn Moisture Data for Queue: ${queue}`,
                      font: { size: 14 }
                    },
                  },
                }}
              />
            </div>

            {statistics && (
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-center mb-4">Statistics</h3>
                <table className="table-auto w-full border-collapse bg-gray-100 shadow-lg rounded-lg">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm">
                      <th className="px-4 py-2 border">N</th>
                      <th className="px-4 py-2 border">Min</th>
                      <th className="px-4 py-2 border">Max</th>
                      <th className="px-4 py-2 border">Range</th>
                      <th className="px-4 py-2 border">Average</th>
                      <th className="px-4 py-2 border">SD</th>
                      <th className="px-4 py-2 border">CV</th>
                      <th className="px-4 py-2 border">Median</th>
                      <th className="px-4 py-2 border">Kurtosis</th>
                      <th className="px-4 py-2 border">Skewness</th>
                      <th className="px-4 py-2 border">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center text-sm text-gray-800 bg-white">
                      <td className="px-4 py-2 border">{statistics.N}</td>
                      <td className="px-4 py-2 border">{statistics.min}</td>
                      <td className="px-4 py-2 border">{statistics.max}</td>
                      <td className="px-4 py-2 border">{statistics.range}</td>
                      <td className="px-4 py-2 border">{statistics.average}</td>
                      <td className="px-4 py-2 border">{statistics.SD}</td>
                      <td className="px-4 py-2 border">{statistics.CV}</td>
                      <td className="px-4 py-2 border">{statistics.median}</td>
                      <td className="px-4 py-2 border">{statistics.kurtosis}</td>
                      <td className="px-4 py-2 border">{statistics.skewness}</td>
                      <td className="px-4 py-2 border">{statistics.variance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-lg text-gray-500">No data available</p>
        )
      )}
    </div>
  );
};

export default CornMoistureChart;
