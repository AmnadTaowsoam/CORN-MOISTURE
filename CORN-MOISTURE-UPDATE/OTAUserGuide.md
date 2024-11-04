# OTA User Guide

## 1. Setting Up a Private Docker Registry (Central Server)

To store Docker images within your organization, follow these steps to create and configure a Private Docker Registry:

### Step 1.1: Install Docker on the Server

Ensure Docker is installed on the server that will act as the Docker Registry.

        sudo apt-get update
        sudo apt-get install -y docker.io

### Step 1.2: Run the Docker Registry

Run the following command to set up the Docker Registry on port 5000:

        docker run -d -p 5000:5000 --name registry --restart=always registry:2

### Step 1.3: Verify the Registry

Test if the registry is working by pushing and pulling an image:

1. Tag an image:

        docker build -t <REGISTRY_IP>:5000/my-service:latest .

2. Push the image to the Registry:

        docker push <REGISTRY_IP>:5000/my-service:latest

3. Pull the image to verify:

        docker pull <REGISTRY_IP>:5000/my-service:latest

### Step 1.4: Configure Client Machines

If the registry uses HTTP (not HTTPS), add the registry IP to insecure-registries:

1. Edit /etc/docker/daemon.json on the client machine:

        {
        "insecure-registries": ["<REGISTRY_IP>:5000"]
        }

2. Restart Docker:

        sudo systemctl restart docker

## 2. Frontend (React) - Adding an Update Button

Create a button or menu in your React Web App for initiating the update process.

### Step 2.1: Add an Update Button

Add an Update button in your React component:

        <button onClick={handleUpdate}>Update</button>

### Step 2.2: Implement the Update Function

Implement the handleUpdate function to send a request to the backend:

        const handleUpdate = async () => {
        try {
            const response = await fetch('/update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error:', error);
            alert('Update failed!');
        }
        };

### Step 2.3: Add Progress Indicators

Enhance user experience by adding a progress bar or status message:

        const [status, setStatus] = useState('');

        const handleUpdate = async () => {
        setStatus('Updating...');
        try {
            const response = await fetch('/update', { ... });
            const data = await response.json();
            setStatus(data.message);
        } catch (error) {
            setStatus('Update failed!');
        }
        };

## 3. Backend (Python) - Update Service

Create a backend service using Python (Flask or FastAPI) that handles the update requests.

### Step 3.1: Setup the Backend

Create a Python file (app.py) and set up Flask:

        from flask import Flask, request, jsonify
        import subprocess
        import jwt  # For token verification
        from functools import wraps

        app = Flask(__name__)
        SECRET_KEY = 'your_secret_key'

        # Middleware to verify access token
        def token_required(f):
            @wraps(f)
            def decorated(*args, **kwargs):
                token = request.headers.get('Authorization')
                if not token or not token.startswith('Bearer '):
                    return jsonify({'message': 'Token is missing or invalid!'}), 403
                try:
                    token = token.split(' ')[1]
                    jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                except jwt.ExpiredSignatureError:
                    return jsonify({'message': 'Token has expired!'}), 403
                except jwt.InvalidTokenError:
                    return jsonify({'message': 'Invalid token!'}), 403
                return f(*args, **kwargs)
            return decorated

        @app.route('/update', methods=['POST'])
        @token_required
        def update_service():
            try:
                subprocess.run("docker-compose pull", shell=True, check=True)
                subprocess.run("docker-compose up -d", shell=True, check=True)
                return jsonify({"message": "Update completed successfully!"}), 200
            except subprocess.CalledProcessError as e:
                return jsonify({"error": str(e)}), 500

        if __name__ == '__main__':
            app.run(host='0.0.0.0', port=5000)

### Step 3.2: Run the Backend Service

Run the Flask app:

        python app.py

## Overall Process:

1. User logs in and clicks the Update button on the Web App.

2. Web App sends a request to the backend with the access token.

3. Backend verifies the token, runs docker-compose pull and docker-compose up -d.

4. Backend sends the status back to the Web App.

5. Web App displays the status to the user, indicating whether the update was successful or failed.

## Final Notes:

1. Security: Ensure the access token is securely generated and verified.

2. Logging: Add logging to the backend for better error tracking.

3. Testing: Test the entire system in a staging environment before deploying in production.

