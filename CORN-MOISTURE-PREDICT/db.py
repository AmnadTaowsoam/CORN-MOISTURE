import os
import uuid
from sqlalchemy import create_engine, Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import logging

# Load environment variables from .env
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database settings from .env
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# Create database URL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Set up SQLAlchemy
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define a table to store predictions as JSON
class PredictionRecord(Base):
    __tablename__ = "predictions"
    __table_args__ = {'schema': 'moisture'}  # Set schema to moisture
    
    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(String, index=True)
    queue = Column(String, index=True)
    date_time = Column(String)
    predictions = Column(JSON)  # Store JSON data
    statistics = Column(JSON)   # JSON field for statistics

# Create the table within the moisture schema
Base.metadata.create_all(bind=engine)

# Function to save predictions and statistics to the database
def save_prediction_to_db(sensor_id, queue, date_time, predictions, statistics):
    db = SessionLocal()
    try:
        # Create a new record with predictions and statistics
        record = PredictionRecord(
            sensor_id=sensor_id,
            queue=queue,
            date_time=date_time,
            predictions=predictions,  # Store predictions as JSON
            statistics=statistics     # Store statistics as JSON
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        logger.info(f"Record with id {record.id} successfully saved to the database.")
        return record.id  # Return the ID of the saved record
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to save prediction to database: {e}")
        raise e
    finally:
        db.close()
