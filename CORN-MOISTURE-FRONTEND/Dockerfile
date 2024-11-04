# Stage 1: Build the project
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code and environment files
COPY . .

# Build the project (output should be in /app/dist)
RUN yarn build

# Stage 2: Setup Nginx to serve the frontend
FROM nginx:alpine

# Set working directory to Nginx's default html directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx files
RUN rm -rf ./*

# Copy the build output from the builder stage to Nginx directory
COPY --from=builder /app/dist .

# Copy custom Nginx configuration (if needed)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port Nginx will listen on
EXPOSE 5003

# Start Nginx in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]

