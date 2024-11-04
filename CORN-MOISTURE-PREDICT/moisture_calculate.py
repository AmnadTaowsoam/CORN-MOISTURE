import logging
import joblib
import pandas as pd
import warnings
import uuid
from scipy.stats import skew, kurtosis
from db import save_prediction_to_db

warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the model
def load_model(model_path='./best_model/best_model_rf.pkl'):
    try:
        model = joblib.load(model_path)
        logger.info("Model loaded successfully.")
        return model
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return None

model = load_model()

def calculate_statistics(sensor_values):
    """
    Calculate statistics for a list of sensor values.
    """
    N = len(sensor_values)
    minimum = float(min(sensor_values))
    maximum = float(max(sensor_values))
    value_range = float(maximum - minimum)
    average = float(sum(sensor_values) / N)
    sd = float(pd.Series(sensor_values).std())
    cv = float((sd / average) * 100) if average != 0 else None
    median = float(pd.Series(sensor_values).median())
    variance = float(pd.Series(sensor_values).var())
    skewness = float(skew(sensor_values))
    kurtosis_val = float(kurtosis(sensor_values))
    
    return {
        "N": N,
        "min": round(minimum, 2),
        "max": round(maximum, 2),
        "range": round(value_range, 2),
        "average": round(average, 2),
        "SD": round(sd, 2),
        "CV": round(cv, 2) if cv else None,
        "median": round(median, 2),
        "variance": round(variance, 2),
        "skewness": round(skewness, 2),
        "kurtosis": round(kurtosis_val, 2)
    }

def moisture_calculate(json_data):
    """
    Process sensor_data in JSON and predict for each value, including statistical calculations.
    """
    logger.info("Received JSON data for moisture calculation.")

    if not model:
        logger.error("Model is not loaded.")
        return {"error": "Model not loaded."}

    # Extract data from JSON
    sensor_id = json_data.get("sensor_id")
    sensor_data = json_data.get("sensor_data", {})
    date_time = json_data.get("date_time")
    queue_id = json_data.get("queue", str(uuid.uuid4()))

    # Prepare predictions dictionary
    predictions = {
        "sensor_id": sensor_id,
        "queue": queue_id,
        "date_time": date_time,
        "predictions": [],
        "statistics": calculate_statistics(list(sensor_data.values()))
    }

    # Process each sensor value for prediction
    for key, sensor_value in sensor_data.items():
        try:
            # Prepare data for model prediction
            data = pd.DataFrame({'sensor_value': [sensor_value]})
            moisture = model.predict(data)
            prediction = {
                "id": key,
                "prediction": round(float(moisture[0]), 2),
                "unit": "percent"
            }
            predictions["predictions"].append(prediction)
            logger.info(f"Prediction for {key}: {prediction['prediction']} {prediction['unit']}")
        except Exception as e:
            logger.error(f"Prediction failed for {key}: {e}")
            predictions["predictions"].append({
                "id": key,
                "error": str(e)
            })

    # Save predictions to the database
    try:
        record_id = save_prediction_to_db(
            sensor_id=sensor_id,
            queue=queue_id,
            date_time=date_time,
            predictions=predictions["predictions"],  # ส่งเฉพาะผลลัพธ์ทำนายรายตัว
            statistics=predictions["statistics"]      # ส่งข้อมูลสถิติแยกออกมา
        )
        logger.info(f"Prediction record saved to the database with id {record_id}.")
    except Exception as e:
        logger.error(f"Failed to save prediction to database: {e}")

    return predictions  # Return as a dictionary