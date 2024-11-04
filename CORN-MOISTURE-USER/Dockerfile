# Use the Node.js 18 slim image as the base
FROM node:18-slim
WORKDIR /app

# Update system packages and install curl
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and yarn.lock to leverage Docker caching
COPY package*.json ./
COPY yarn.lock .

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy the rest of your application source code
COPY . .

# Make sure to copy the .env file if it's not meant to be in the .dockerignore
# COPY ../.env ./

# Set permissions for non-root user 'node' and switch to it
RUN chown -R node:node /app
USER node

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run your app
CMD ["node", "src/app.js"]   