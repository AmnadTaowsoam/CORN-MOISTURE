# Stage 1: Build Stage
FROM python:3.10-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libpq5  # ติดตั้ง libpq5 เพื่อให้สามารถใช้ psycopg2 ได้

# Set the working directory in the container
WORKDIR /app

# Copy only the requirements file and environment file to avoid cache invalidation
COPY requirements.txt ./

# Install the required Python packages in a virtual environment
RUN python -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install --no-cache-dir -r requirements.txt && \
    apt-get purge -y --auto-remove build-essential && \
    rm -rf /var/lib/apt/lists/*

# Stage 2: Final Image
FROM python:3.10-slim

# Install libpq5 for psycopg2 compatibility
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/venv/bin:$PATH"

# Copy the virtual environment from the builder stage
COPY --from=builder /venv /venv

# Set the working directory in the container
WORKDIR /app

# Copy the project files into the container
COPY . .

# Expose the port on which the FastAPI app will run
EXPOSE 5001

# Use an unprivileged user to run the app
RUN useradd -m myuser
USER myuser

# Command to run the FastAPI app using the installed virtual environment
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5001"]
