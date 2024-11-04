// services/updateService.js

const defaultEndpoint = import.meta.env.VITE_REACT_APP_UPDATE_SERVICE_ENDPOINT || 'http://localhost:5763';

export const fetchStatus = async (endpoint = defaultEndpoint) => {
  try {
    const response = await fetch(`${endpoint}/status`);
    if (!response.ok) throw new Error('Failed to fetch status');
    const data = await response.json();
    return data.status || 'Unknown';
  } catch (error) {
    console.error('Error fetching status:', error);
    throw error;
  }
};

export const startUpdate = async (endpoint = defaultEndpoint) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${endpoint}/api/v1/update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });    
    if (!response.ok) throw new Error('Failed to start update');
    return 'Update started successfully';
  } catch (error) {
    console.error('Error starting update:', error);
    throw error;
  }
};

  
  