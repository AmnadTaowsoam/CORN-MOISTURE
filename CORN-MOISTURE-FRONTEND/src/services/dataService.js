// dataService.js

const API_BASE_URL = import.meta.env.VITE_REACT_APP_CORN_MOISTURE_DATA_SERVICE_ENDPOINT;;
const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY; // ดึง API Key จาก .env

async function fetchAllPredictions() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/predictions`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching predictions: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchAllPredictions:', error);
    throw error;
  }
}

async function fetchPredictionBySensorId(sensor_id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/predictions/${sensor_id}`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching prediction for sensor ID ${sensor_id}: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchPredictionBySensorId:', error);
    throw error;
  }
}

async function fetchPredictionByQueue(queue) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/predictions/queue/${queue}`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching prediction for queue ${queue}: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchPredictionByQueue:', error);
    throw error;
  }
}

export { fetchAllPredictions, fetchPredictionBySensorId, fetchPredictionByQueue };
