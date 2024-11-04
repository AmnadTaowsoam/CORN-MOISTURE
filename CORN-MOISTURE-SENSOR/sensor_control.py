# sensor_control.py
import os
from pyModbusTCP.client import ModbusClient
import logging
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

class MoistureSensor:
    def __init__(self):
        # Load configuration from environment variables
        self.host = os.getenv("MOISTURE_SENSOR_HOST", "127.0.0.1")
        self.port = int(os.getenv("MOISTURE_SENSOR_PORT", 502))
        self.address = int(os.getenv("MOISTURE_SENSOR_ADDRESS", 1000))
        self.sensorId = os.getenv("MOISTURE_SENSOR_ID", "NMMoisture01")

        self.client = ModbusClient(host=self.host, port=self.port, auto_open=True)
        
        # Check connection to Modbus server
        logging.info(f"Connecting to Modbus server at {self.host}:{self.port}")
        if self.client.open():
            logging.info("Successfully connected to Modbus server.")
        else:
            logging.error("Failed to connect to Modbus server.")

    def read_data(self, start_key=2001):
        # Read data from sensor
        data = self.client.read_holding_registers(self.address, 1)
        if data:
            return start_key, float(data[0]) / 100.0
        else:
            logging.warning("Failed to read data from the moisture sensor")
            return None

    def close_connection(self):
        self.client.close()
