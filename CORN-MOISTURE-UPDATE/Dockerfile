# Dockerfile
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install necessary system dependencies, including Docker CLI
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    libssl-dev \
    git \
    docker.io \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the port
EXPOSE 5763

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5763"]
