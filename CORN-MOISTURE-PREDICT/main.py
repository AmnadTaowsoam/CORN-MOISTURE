import os
import uvicorn
import logging
from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from moisture_calculate import moisture_calculate

# สร้าง path ไปยังไฟล์ .env ที่อยู่ใน root ของโปรเจกต์
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
    allow_origins=["*"],  # Restrict to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # Consider restricting methods for security
    allow_headers=["*"],  # Specify allowed headers as needed
)

# Define the request model
class SensorDataRequest(BaseModel):
    queue: str
    date_time: str
    sensor_id: str
    sensor_data: dict

# API Endpoint for moisture calculation
@app.post("/v1/moisture")
async def process_sensor_data(
    request: SensorDataRequest, api_key: str = Depends(get_api_key)
):
    # Log received sensor data for debugging
    logger.info(f"Received request for sensor_id: {request.sensor_id}")
    logger.debug(f"Sensor data: {request.sensor_data}")

    # Process the sensor data using moisture_calculate
    try:
        moisture_result = moisture_calculate(request.dict())
        logger.info("Moisture calculation successful.")
        logger.debug(f"Moisture result: {moisture_result}")
    except Exception as e:
        logger.error(f"Error in moisture calculation: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing sensor data: {e}")
    print(f'moisture_result:{moisture_result}')

    # Return response to client
    return {"status": "success", "message": "Data processed successfully", "data": moisture_result}

if __name__ == "__main__":
    # ดึงค่าจาก .env สำหรับ host และ port
    host = os.getenv("PREDICT_HOST", "127.0.0.1")  # ถ้าไม่พบใน .env จะใช้ค่าเริ่มต้นเป็น 127.0.0.1
    port = int(os.getenv("PREDICT_PORT", 5001))    # ถ้าไม่พบใน .env จะใช้ค่าเริ่มต้นเป็น 8000

    logger.info("Starting server...")
    uvicorn.run(app, host=host, port=port)