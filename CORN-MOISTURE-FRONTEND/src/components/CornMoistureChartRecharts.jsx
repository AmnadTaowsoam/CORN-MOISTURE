// components/CornMoistureChartRecharts.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CornMoistureChartRecharts = ({ chartData, queue, statistics, loading }) => {

  return (
    <div className="w-full max-w-10xl mx-auto my-8 p-8 bg-gradient-to-r from-purple-500 to-blue-500 shadow-xl rounded-lg text-white">
      <div className="text-center text-lg font-semibold mb-8">
        Moisture Data for Queue: <span className="font-bold text-yellow-200">{queue}</span>
      </div>

      {loading ? (
        <p className="text-center text-lg text-yellow-200">Loading...</p>
      ) : (
        chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff50" />
                <XAxis dataKey="id" stroke="#FFF" />
                <YAxis stroke="#FFF" />
                <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#666' }} />
                <Legend wrapperStyle={{ color: '#FFF' }} />
                <Line type="monotone" dataKey="prediction" stroke="#FFCC00" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>

            {statistics && (
              <div className="mt-10 bg-white text-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-center mb-4 text-purple-700">Statistics</h3>
                <table className="table-auto w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-purple-200 text-purple-800">
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
                    <tr className="text-center bg-purple-50">
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
          <p className="text-center text-lg text-yellow-200">No data available</p>
        )
      )}
    </div>
  );
};

export default CornMoistureChartRecharts;
