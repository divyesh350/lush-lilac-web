# Lush Lilac - MERN Stack E-commerce Platform

## 🚀 Project Overview
Lush Lilac is a modern e-commerce platform built with the MERN (MongoDB, Express.js, React.js, Node.js) stack. This platform focuses on providing a seamless shopping experience with features like user authentication, product management, and order processing.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (Access & Refresh Tokens)
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer
- **Payment Gateway**: Razorpay

## 📦 Dependencies
```json
{
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.1",
    "mongoose": "^7.5.0",
    "morgan": "^1.10.0",
    "cloudinary": "^1.36.0",
    "nodemailer": "^6.9.4",
    "razorpay": "^2.8.6"
  }
}
```

## 🔐 Environment Variables
Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Nodemailer Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 📝 User Authentication Flow

### 1. Registration Flow
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (201):
{
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (400):
{
  "message": "User already exists"
}
```

### 2. Login Flow
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (200):
{
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (401):
{
  "message": "Invalid email or password"
}
```

### 3. Token Refresh
```http
GET /api/v1/auth/refresh
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (403):
{
  "message": "Invalid or expired refresh token"
}
```

### 4. Logout
```http
POST /api/v1/auth/logout
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200):
{
  "message": "Logged out successfully"
}
```

## 📚 API Documentation

### User Routes

#### Register User
- **Endpoint**: POST `/api/v1/auth/register`
- **Purpose**: Create a new user account
- **Request Body**: 
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**: 201 Created
- **Error Responses**:
  - 400 Bad Request: User already exists
  - 500 Internal Server Error: Registration failed

#### Login User
- **Endpoint**: POST `/api/v1/auth/login`
- **Purpose**: Authenticate user and generate tokens
- **Request Body**: 
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**: 200 OK
- **Error Responses**:
  - 401 Unauthorized: Invalid email or password
  - 500 Internal Server Error: Login failed

#### Refresh Token
- **Endpoint**: GET `/api/v1/auth/refresh`
- **Purpose**: Get new access token using refresh token
- **Headers**: 
  ```json
  {
    "Cookie": "refreshToken=..."
  }
  ```
- **Success Response**: 200 OK
- **Error Responses**:
  - 401 Unauthorized: No refresh token
  - 403 Forbidden: Invalid or expired refresh token

#### Logout
- **Endpoint**: POST `/api/v1/auth/logout`
- **Purpose**: Invalidate refresh token and clear cookies
- **Headers**: 
  ```json
  {
    "Cookie": "refreshToken=..."
  }
  ```
- **Success Response**: 200 OK
- **Error Responses**:
  - 500 Internal Server Error: Logout failed

## 🛡️ Security Features

1. **JWT Authentication**:
   - Dual token system (Access & Refresh tokens)
   - Access tokens expire after 15 minutes
   - Refresh tokens expire after 7 days
   - Secure cookie storage for refresh tokens

2. **Password Security**:
   - Password hashing with bcrypt
   - Minimum password requirements
   - Secure password comparison

3. **Rate Limiting**:
   - Limited login attempts
   - Protection against brute force attacks

4. **Data Validation**:
   - Input validation for all requests
   - Email format validation
   - Required field checks

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Start the server:
   ```bash
   npm start
   ```

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author
- **Name**: [Your Name]
- **Email**: [your.email@example.com]
- **GitHub**: [your-github-profile]

## 🔍 Project Structure
```
/server
├── /config
│   ├── db.js
│   ├── cloudinary.js
│   ├── nodemailer.js
│   ├── razorpay.js
│   └── dotenv.js
│
├── /controllers
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── product.controller.js
│   ├── order.controller.js
│   ├── upload.controller.js
│   ├── newsletter.controller.js
│   └── analytics.controller.js
│
├── /models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Artwork.js
│   ├── Newsletter.js
│   └── Token.js
│
├── /routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── product.routes.js
│   ├── order.routes.js
│   ├── upload.routes.js
│   ├── newsletter.routes.js
│   └── analytics.routes.js
│
├── /middlewares
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   └── error.middleware.js
│
├── /utils
│   ├── jwt.util.js
│   ├── email.util.js
│   └── generateReceipt.js
│
├── /uploads
│
├── app.js
├── server.js
└── .env
```

## 📊 API Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error