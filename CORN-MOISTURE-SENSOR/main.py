# main.py
import os
import uvicorn
import logging
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from sensor_control import MoistureSensor
import requests

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path)

# FastAPI app initialization
app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API Key and Security Settings
API_KEY = os.getenv("API_KEY")
API_KEY_NAME = "X-API-Key"

# Build EXTERNAL_URL using host and port from .env
PREDICT_HOST = os.getenv("PREDICT_HOST", "127.0.0.1")
PREDICT_PORT = os.getenv("PREDICT_PORT", "5001")
EXTERNAL_URL = f"http://{PREDICT_HOST}:{PREDICT_PORT}/v1/moisture"

api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def get_api_key(api_key: str = Security(api_key_header)):
    if api_key == API_KEY:
        logger.info("API key validated successfully.")
        return api_key
    else:
        logger.warning("Invalid API key attempt.")
        raise HTTPException(status_code=403, detail="Could not validate credentials")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the request model, now with a queue field
class SensorDataRequest(BaseModel):
    queue: str

# Initialize sensor instance
sensor = MoistureSensor()
sensor_data = {}
current_key = 2001

# Mock sensor data for testing
MOCK_SENSOR_DATA = {
    "1477": 23.72,
    "1478": 22.12,
    "1479": 20.47,
    "1480": 18.0,
    "1481": 23.72,
    "1482": 22.12,
    "1483": 20.47,
    "1484": 18.0,
    "1485": 23.72,
    "1486": 22.12,
    "1487": 20.47,
    "1488": 18.0
}

# Update the /v1/sensor-start endpoint to accept queue from request
@app.post("/v1/sensor-start")
async def process_sensor_data(request: SensorDataRequest, api_key: str = Depends(get_api_key)):
    global current_key
    queue = request.queue  # Extract queue from the request

    # Read data from the sensor
    result = sensor.read_data(current_key)
    if result is None:
        # Use mock data if sensor data is unavailable
        logging.warning("No sensor data available; using mock data.")
        sensor_data.update(MOCK_SENSOR_DATA)
    else:
        key, value = result
        sensor_data[str(key)] = value
        logging.info(f"Read value: {value} at key: {key}")
        current_key += 1  # Increment the key for the next reading

    # Prepare data for response with the provided queue
    response_data = {
        "queue": queue,
        "date_time": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "sensor_id": "NMMoisture01",  # Use the provided mock sensor_id
        "sensor_data": sensor_data
    }

    # Process data and send to external API
    try:
        headers = {
            "X-API-Key": api_key,  # Use the provided API key
            "Content-Type": "application/json"
        }
        response = requests.post(EXTERNAL_URL, json=response_data, headers=headers)

        # Check if the external API call was successful
        if response.status_code == 200:
            logging.info("Data sent to external API successfully.")
            return {"status": "success", "message": "Data processed and sent successfully", "data": response_data}
        else:
            logging.error(f"Failed to send data to external API: {response.text}")
            raise HTTPException(status_code=response.status_code, detail="Failed to send data to external API")

    except Exception as e:
        logging.error(f"Error in moisture calculation or API request: {e}")
        raise HTTPException(status_code=500, detail="Error processing sensor data.")

if __name__ == "__main__":
    host = os.getenv("PREDICT_HOST", "127.0.0.1")
    port = int(os.getenv("SENSOR_SERVICE_PORT", 5004))
    logger.info("Starting server...")
    try:
        uvicorn.run(app, host=host, port=port)
    finally:
        # Close the sensor connection when stopping the server
        sensor.close_connection()