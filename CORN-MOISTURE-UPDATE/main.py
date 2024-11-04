import os
import logging
from datetime import timedelta
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt  # python-jose library
from pydantic import BaseModel
from dotenv import load_dotenv
import subprocess
import uvicorn
import httpx

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(dotenv_path)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables for secrets and algorithms
SECRET_KEY = os.getenv("ACCESS_TOKEN_SECRET", "your_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Load environment variables for Docker Registry
REGISTRY_URL = os.getenv("QI_REGISTRY_HUB_URL", "http://localhost")
REGISTRY_PORT = os.getenv("QI_REGISTRY_HUB_PORT", "5000")
REGISTRY_USERNAME = os.getenv("QI_REGISTRY_HUB_USERNAME", "username")
REGISTRY_PASSWORD = os.getenv("QI_REGISTRY_HUB_PASSWORD", "password")

# Load allowed origins from environment variable
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

# Pydantic models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

# Create an instance of FastAPI
app = FastAPI(title="OTA Update Service", version="1.0")

# Add middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Use allowed origins from .env
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods such as GET, POST, PUT, DELETE
    allow_headers=["*"],  # Allow all headers such as Authorization
)

# Dependency to verify current user
async def get_current_user(request: Request):
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        logger.warning("Authorization token is missing or invalid")
        raise HTTPException(status_code=401, detail="Token is missing or invalid")
    token = token.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Extract username from the correct field
        username: str = payload.get("username")
        if username is None:
            logger.warning("Token payload is missing username")
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        # Verify user by calling USER-SERVICE
        async with httpx.AsyncClient() as client:
            USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost")
            USER_SERVICE_PORT = os.getenv("USER_SERVICE_PORT", "5000")

            headers = {
                "Authorization": f"Bearer {token}"  # Pass the token from the client request
            }

            logger.info(f"Verifying user {username} with USER-SERVICE")
            response = await client.get(f"{USER_SERVICE_URL}:{USER_SERVICE_PORT}/v1/users/get-user-info/{username}", headers=headers)
            if response.status_code != 200:
                logger.error(f"User verification failed for {username}. Status code: {response.status_code}")
                raise HTTPException(status_code=401, detail="User verification failed")
            logger.info(f"User {username} verified successfully")

        return TokenData(username=username)
    except JWTError as e:
        logger.error(f"JWT decoding error: {str(e)}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# Endpoint for update service
@app.post("/api/v1/update")
async def update_service(request: Request, current_user: TokenData = Depends(get_current_user)):
    try:
        # ตรวจสอบว่า REGISTRY_URL มีการตั้งค่าหรือไม่
        if REGISTRY_URL and REGISTRY_URL != "http://localhost":
            logger.info("Logging in to Private Docker Registry...")
            login_command = ["docker", "login", f"{REGISTRY_URL}:{REGISTRY_PORT}", "-u", REGISTRY_USERNAME, "--password-stdin"]
            process = subprocess.Popen(login_command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = process.communicate(input=f"{REGISTRY_PASSWORD}\n".encode())
            if process.returncode != 0:
                logger.error(f"Docker login failed: {stderr.decode().strip()}")
                raise HTTPException(status_code=500, detail=f"Docker login failed: {stderr.decode().strip()}")
            logger.info("Docker login to private registry completed successfully")
        else:
            logger.info("Skipping Docker login step as REGISTRY_URL is not set or is localhost")

        # Pull and deploy using docker-compose
        logger.info("Starting update process...")
        subprocess.run(["docker-compose", "pull"], check=True)
        logger.info("Docker-compose pull completed successfully")
        subprocess.run(["docker-compose", "up", "-d"], check=True)
        logger.info("Docker-compose up completed successfully")

        return {"message": "Update completed successfully!"}
    except subprocess.CalledProcessError as e:
        logger.error(f"Update failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

if __name__ == "__main__":
    # Load host and port from .env
    host = os.getenv("UPDATE_SERVICE_HOST", "127.0.0.1")
    port = int(os.getenv("UPDATE_SERVICE_PORT", 5763))

    logger.info(f"Starting server on {host}:{port}...")
    uvicorn.run(app, host=host, port=port)
