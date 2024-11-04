// routes/predictionRoutes.js
const express = require('express');
const router = express.Router();
const predictionModel = require('../models/predictionModel');

// สร้างการทำนายใหม่
router.post('/predictions', async (req, res) => {
    try {
        const { sensor_id, queue, date_time, predictions, statistics } = req.body;
        const newPrediction = await predictionModel.createPrediction(sensor_id, queue, date_time, predictions, statistics);
        res.status(201).json(newPrediction);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create prediction', details: err.message });
    }
});

// ดึงข้อมูลทั้งหมดจากตาราง predictions
router.get('/predictions', async (req, res) => {
    try {
        const predictions = await predictionModel.getAllPredictions();
        res.status(200).json(predictions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch all predictions', details: err.message });
    }
});

// ดึงข้อมูลตาม sensor_id
router.get('/predictions/:sensor_id', async (req, res) => {
    try {
        const { sensor_id } = req.params;
        const predictions = await predictionModel.getPredictionsBySensorId(sensor_id);
        res.status(200).json(predictions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch predictions by sensor_id', details: err.message });
    }
});

// ลบข้อมูลตาม id
router.delete('/predictions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPrediction = await predictionModel.deletePredictionById(id);
        if (deletedPrediction) {
            res.status(200).json({ message: 'Prediction deleted successfully', deletedPrediction });
        } else {
            res.status(404).json({ error: 'Prediction not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete prediction', details: err.message });
    }
});

// อัปเดตข้อมูลตาม id
router.put('/predictions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedPrediction = await predictionModel.updatePrediction(id, updates);
        if (updatedPrediction) {
            res.status(200).json(updatedPrediction);
        } else {
            res.status(404).json({ error: 'Prediction not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update prediction', details: err.message });
    }
});

// เส้นทางค้นหาตาม queue
router.get('/predictions/queue/:queue', async (req, res) => {
    try {
        const { queue } = req.params;
        const predictions = await predictionModel.getPredictionsByQueue(queue);
        res.status(200).json(predictions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch predictions by queue', details: err.message });
    }
});

module.exports = router;
