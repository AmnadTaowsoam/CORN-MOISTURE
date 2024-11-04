// models/predictionModel.js
const db = require("../config/database");

const createPrediction = async (
  sensor_id,
  queue,
  date_time,
  predictions,
  statistics
) => {
  const query = `
        INSERT INTO moisture.predictions (sensor_id, queue, date_time, predictions, statistics)
        VALUES ($1, $2, $3, $4::jsonb, $5::jsonb) RETURNING *;
    `;
  const values = [sensor_id, queue, date_time, predictions, statistics];
  const res = await db.query(query, values);
  return res.rows[0];
};

const getPredictionsBySensorId = async (sensor_id) => {
  const query = `SELECT * FROM moisture.predictions WHERE sensor_id = $1`;
  const res = await db.query(query, [sensor_id]);
  return res.rows;
};

// ดึงข้อมูลทั้งหมดจากตาราง predictions
const getAllPredictions = async () => {
  const query = `SELECT * FROM moisture.predictions`;
  const res = await db.query(query);
  return res.rows;
};

// ลบข้อมูลจากตาราง predictions โดยใช้ id
const deletePredictionById = async (id) => {
  const query = `DELETE FROM moisture.predictions WHERE id = $1 RETURNING *`;
  const res = await db.query(query, [id]);
  return res.rows[0];
};

// อัปเดตข้อมูลในตาราง predictions
const updatePrediction = async (id, updates) => {
  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${i}`);
    values.push(value);
    i++;
  }

  const query = `
        UPDATE moisture.predictions
        SET ${fields.join(", ")}
        WHERE id = $${i} RETURNING *;
    `;
  values.push(id);
  const res = await db.query(query, values);
  return res.rows[0];
};

// ดึงข้อมูลจากตาราง predictions โดยใช้ queue
const getPredictionsByQueue = async (queue) => {
  const query = `SELECT * FROM moisture.predictions WHERE queue = $1`;
  const res = await db.query(query, [queue]);
  return res.rows;
};

module.exports = {
  createPrediction,
  getPredictionsBySensorId,
  getAllPredictions,
  deletePredictionById,
  updatePrediction,
  getPredictionsByQueue,
};
