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

### Product Routes

#### Create Product
- **Endpoint**: POST `/api/v1/products`
- **Purpose**: Create a new product with media files
- **Authentication**: Required (Admin only)
- **Request**: Multipart Form Data
  ```
  title: "Product Title" (required)
  description: "Product Description" (required)
  price: 29.99 (required)
  variants: JSON string of variants array (required)
  media: Files (images/videos) (required, at least one)
  ```
- **Success Response**: 201 Created
  ```json
  {
    "_id": "product123",
    "title": "Product Title",
    "description": "Product Description",
    "price": 29.99,
    "variants": [
      {
        "size": "Medium",
        "color": "Blue",
        "material": "Cotton",
        "stock": 10
      }
    ],
    "media": [
      {
        "url": "/uploads/media-1234567890.jpg",
        "type": "image",
        "public_id": "media-1234567890",
        "originalname": "product-image.jpg",
        "size": 102400,
        "mimetype": "image/jpeg"
      }
    ],
    "createdAt": "2025-05-16T14:00:00.000Z",
    "updatedAt": "2025-05-16T14:00:00.000Z"
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Missing required fields or invalid data
  - 401 Unauthorized: Authentication required
  - 403 Forbidden: Not an admin user
  - 500 Internal Server Error: Product creation failed

#### Get All Products
- **Endpoint**: GET `/api/v1/products`
- **Purpose**: Retrieve all products
- **Authentication**: Not required
- **Success Response**: 200 OK
  ```json
  [
    {
      "_id": "product123",
      "title": "Product Title",
      "description": "Product Description",
      "price": 29.99,
      "variants": [...],
      "media": [...],
      "createdAt": "2025-05-16T14:00:00.000Z",
      "updatedAt": "2025-05-16T14:00:00.000Z"
    },
    {...}
  ]
  ```

#### Get Product by ID
- **Endpoint**: GET `/api/v1/products/:id`
- **Purpose**: Retrieve a specific product by ID
- **Authentication**: Not required
- **Success Response**: 200 OK
  ```json
  {
    "_id": "product123",
    "title": "Product Title",
    "description": "Product Description",
    "price": 29.99,
    "variants": [...],
    "media": [...],
    "createdAt": "2025-05-16T14:00:00.000Z",
    "updatedAt": "2025-05-16T14:00:00.000Z"
  }
  ```
- **Error Responses**:
  - 404 Not Found: Product not found

#### Update Product
- **Endpoint**: PUT `/api/v1/products/:id`
- **Purpose**: Update an existing product
- **Authentication**: Required (Admin only)
- **Request**: Multipart Form Data
  ```
  title: "Updated Title" (optional)
  description: "Updated Description" (optional)
  price: 39.99 (optional)
  variants: JSON string of variants array (optional)
  media: Files (images/videos) (optional)
  ```
- **Success Response**: 200 OK
  ```json
  {
    "_id": "product123",
    "title": "Updated Title",
    "description": "Updated Description",
    "price": 39.99,
    "variants": [...],
    "media": [...],
    "createdAt": "2025-05-16T14:00:00.000Z",
    "updatedAt": "2025-05-16T14:30:00.000Z"
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Invalid data
  - 401 Unauthorized: Authentication required
  - 403 Forbidden: Not an admin user
  - 404 Not Found: Product not found
  - 500 Internal Server Error: Update failed

#### Delete Product
- **Endpoint**: DELETE `/api/v1/products/:id`
- **Purpose**: Delete a product and its associated media
- **Authentication**: Required (Admin only)
- **Success Response**: 200 OK
  ```json
  {
    "message": "Deleted successfully"
  }
  ```
- **Error Responses**:
  - 401 Unauthorized: Authentication required
  - 403 Forbidden: Not an admin user
  - 404 Not Found: Product not found
  - 500 Internal Server Error: Deletion failed

## 📤 Media Upload Workflow

### Overview
Lush Lilac implements a two-stage media upload process for product images and videos:
1. **Local Storage**: Files are first uploaded to the server's local storage
2. **Cloudinary**: Files are then uploaded to Cloudinary in the background

This approach provides several benefits:
- Immediate response to the client without waiting for Cloudinary upload
- Resilience against Cloudinary service disruptions
- Reduced client-side waiting time

### Detailed Workflow

#### 1. Client Uploads Media
- Client sends a multipart form request with product data and media files
- Request goes through authentication and role verification middleware
- Upload middleware processes the files:
  - Creates unique filenames
  - Validates file types (images: jpeg, png, gif, svg; videos: mp4, webm)
  - Enforces file size limits (10MB per file)
  - Stores files in the server's `/uploads` directory

#### 2. Initial Product Creation/Update
- Product controller receives the request with processed files
- Controller creates media objects with local file paths
- Product is saved to MongoDB with local media URLs
- Response is immediately sent back to the client

#### 3. Background Cloudinary Upload
- After responding to the client, a background process starts
- For each media file:
  - The file is compressed if it's an image (using Sharp)
  - The compressed file is uploaded to Cloudinary with retry logic
  - The local file is deleted after successful upload

#### 4. Product Update with Cloudinary URLs
- Once all files are uploaded to Cloudinary, the product is updated
- Local file URLs are replaced with Cloudinary URLs
- The `cloudinary` flag is set to true for each media item

#### 5. Media Deletion
- When a product is deleted, all associated media is also deleted from Cloudinary
- The product controller uses the stored `public_id` to identify and delete media

### Code Flow Diagram
```
Client Request → Auth Middleware → Role Middleware → Upload Middleware
    ↓
Product Controller → Save to MongoDB with local URLs → Respond to Client
    ↓
Background Process → Compress Images → Upload to Cloudinary → Delete Local Files
    ↓
Update Product in MongoDB with Cloudinary URLs
```

### Configuration
To enable Cloudinary uploads, set the following environment variables:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

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