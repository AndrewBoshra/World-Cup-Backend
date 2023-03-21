# World Cup Matches Backend
This backend application was built using Express.js, MongoDB, and JWT authentication. It includes Paypal payment integration and allows for the management of stadium data, team data, match data, user reservations, and user management.

### Installation
Clone the repo: git clone https://github.com/AndrewBoshra/World-Cup-Backend.git
Install dependencies

```bash
  npm install
```

### Configuration
Before running the application, you will need to configure several environment variables:


PORT: Optional, the port number to run the server on (default is 3000)
ENV: The environment mode - either "development" or "production"
MONGO_USER: The username for your MongoDB database
MONGO_PASSWORD: The password for your MongoDB database
MONGO_URL: The URL for your MongoDB database
JWT_PASSWORD: The secret key used to sign and verify JWTs
ROOT_URL: The root URL for the application
IMAGE_UPLOADS: The directory path for uploaded images
PAYPAL_CLIENT_ID: The client ID for your PayPal REST API integration
PAYPAL_CLIENT_SECRET: The client secret for your PayPal REST API integration

```env
You can create a .env file in the root directory of the project to set these environment variables. Here's an example:
PORT=3000
ENV=development
MONGO_USER=myusername
MONGO_PASSWORD=mypassword
MONGO_URL=mongodb://localhost/world-cup-matches
JWT_PASSWORD=my-secret-key
ROOT_URL=http://localhost:3000
IMAGE_UPLOADS=/uploads
PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-client-secret

```
Running the Application
To start the server, run 
```bash
  npm start
```
