// services/moistureSensorService.js

const API_BASE_URL = import.meta.env.VITE_REACT_APP_MOISTURE_SENSOR_SERVICE_ENDPOINT; // Make sure this is in your .env file
const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY; // ดึง API Key จาก .env

export async function startDataCollection(queue) {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/sensor-start`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ queue }),
    });

    if (!response.ok) {
      throw new Error(`Error starting data collection: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Data collection started successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in startDataCollection:", error);
    throw error;
  }
}
