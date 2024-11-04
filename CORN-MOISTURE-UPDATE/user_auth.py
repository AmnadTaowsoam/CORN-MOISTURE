## user_auth.py
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt  # python-jose library
from pydantic import BaseModel
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

# Load environment variables for secrets and algorithms
SECRET_KEY = os.getenv("ACCESS_TOKEN_SECRET", "your_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Simulated user database
fake_users_db = {
    "user1": {
        "username": "user1",
        "password": "password1"  # Use hashed passwords in production
    }
}

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")

# Pydantic models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

# Function to authenticate user
def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    if user and user["password"] == password:  # Replace with password hashing check in production
        return user
    return None

# Function to create an access token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency to verify current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
        return TokenData(username=username)
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
