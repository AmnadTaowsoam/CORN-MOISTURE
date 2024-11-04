// pages/UpdatePages.jsx

import React, { useState, useEffect } from 'react';
import { fetchStatus, startUpdate } from '../services/updateService';

function UpdatePage() {
  const [status, setStatus] = useState('Loading...');
  const [updateInProgress, setUpdateInProgress] = useState(false);

  useEffect(() => {
    fetchStatus()
      .then((status) => setStatus(status))
      .catch(() => setStatus('Error fetching status'));
  }, []);
  
  const handleUpdateClick = async () => {
    setUpdateInProgress(true);
    try {
      const result = await startUpdate();
      setStatus(result);
    } catch (error) {
      setStatus(`Error starting update: ${error.message}`);
    } finally {
      setUpdateInProgress(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OTA Update Status</h1>
      <p className="mb-4">Current Status: {status}</p>
      <button
        onClick={handleUpdateClick}
        className="btn btn-primary"
        disabled={updateInProgress}
      >
        {updateInProgress ? 'Updating...' : 'Start Update'}
      </button>
    </div>
  );
}

export default UpdatePage;
