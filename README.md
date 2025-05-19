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

## 📦 Order Workflow

### Overview
Lush Lilac implements a comprehensive order processing system with the following key features:
1. **Razorpay Integration**: Secure payment processing
2. **PDF Receipt Generation**: Automatic creation of order receipts
3. **Email Notifications**: Order confirmation emails with receipt attachments
4. **Order Status Management**: Admin controls for order fulfillment

### Order Data Model

The Order model consists of:
- **User**: Reference to the customer who placed the order
- **Items**: Array of ordered products with variants and quantities
- **TotalAmount**: The total order value
- **ShippingAddress**: Delivery location
- **Status**: Current order status (pending, accepted, in production, supplied, completed)
- **PaymentInfo**: Payment details from Razorpay

### Detailed Workflow

#### 1. Payment Initiation
- Client requests a Razorpay order creation
- Server creates a Razorpay order with unique ID
- Client receives order details for payment processing

#### 2. Order Creation
- After successful payment, client sends order details to server
- Server validates the order data and payment information
- New order is created in the database with 'pending' status
- Order is linked to the user account

#### 3. Receipt Generation
- System automatically generates a PDF receipt using PDFKit
- Receipt includes:
  - Order details (ID, date, customer info)
  - Items purchased with variants
  - Pricing information
  - Payment status
  - Shipping address

#### 4. Email Notification
- System sends an order confirmation email to the customer
- Email includes a thank you message and order summary
- PDF receipt is attached to the email
- Emails are sent via Nodemailer using Gmail SMTP

#### 5. Order Management
- Admin can view all orders with filtering and pagination
- Customers can view their own order history
- Admin can update order status as it progresses
- Both admin and order owner can view detailed order information

### PDF Receipt Generation

The PDF receipt is generated using the following process:
1. **Initialization**: Create a new PDFDocument instance
2. **Content Addition**: Add order details, customer info, and items
3. **Styling**: Apply formatting for readability
4. **Buffer Creation**: Convert the PDF to a buffer for email attachment
5. **Response**: Send the PDF buffer to the client as base64

```javascript
// PDF Generation Flow
const pdfBuffer = await generateReceiptPDF(order);  // Create PDF buffer
nconst base64PDF = pdfBuffer.toString('base64');     // Convert to base64 for client
n```

### Email System

The email system uses Nodemailer with the following configuration:
1. **Transporter**: SMTP connection to Gmail
2. **Authentication**: Uses environment variables for credentials
3. **Composition**: Creates email with subject, text, and attachments
4. **Delivery**: Sends email asynchronously

```javascript
// Email Sending Flow
await sendEmail(
  customer.email,
  "Order Confirmation",
  "Thank you for your order",
  [{ filename: 'receipt.pdf', content: pdfBuffer }]
);
```

### API Endpoints

#### Create Razorpay Order
- **Endpoint**: POST `/api/v1/orders/create-payment`
- **Purpose**: Initialize payment process with Razorpay
- **Authentication**: Required (Customer only)
- **Request Body**:
  ```json
  {
    "amount": 2999,
    "currency": "INR",
    "receipt": "receipt_123" // optional
  }
  ```
- **Success Response**: 200 OK
  ```json
  {
    "id": "order_123456789",
    "entity": "order",
    "amount": 299900,
    "currency": "INR",
    "receipt": "receipt_123",
    "status": "created"
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Missing amount
  - 500 Internal Server Error: Razorpay order creation failed

#### Create Order
- **Endpoint**: POST `/api/v1/orders`
- **Purpose**: Create a new order after successful payment
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "items": [
      {
        "productId": "product123",
        "variant": {
          "size": "Medium",
          "color": "Blue",
          "material": "Cotton"
        },
        "quantity": 2,
        "price": 1499
      }
    ],
    "totalAmount": 2998,
    "shippingAddress": "123 Main St, City, Country",
    "paymentInfo": {
      "paymentId": "pay_123456789",
      "orderId": "order_123456789",
      "signature": "signature_123",
      "paid": true,
      "method": "card",
      "amount": 2998,
      "currency": "INR"
    }
  }
  ```
- **Success Response**: 201 Created
  ```json
  {
    "message": "Order placed successfully",
    "order": {
      "_id": "order123",
      "user": "user123",
      "items": [...],
      "totalAmount": 2998,
      "shippingAddress": "123 Main St, City, Country",
      "status": "pending",
      "paymentInfo": {...},
      "createdAt": "2025-05-19T12:30:00.000Z",
      "updatedAt": "2025-05-19T12:30:00.000Z"
    },
    "receiptPDF": "data:application/pdf;base64,..."
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Missing required fields
  - 500 Internal Server Error: Order creation failed

#### Get My Orders
- **Endpoint**: GET `/api/v1/orders/my`
- **Purpose**: Retrieve all orders for the logged-in user
- **Authentication**: Required
- **Success Response**: 200 OK
  ```json
  [
    {
      "_id": "order123",
      "user": "user123",
      "items": [...],
      "totalAmount": 2998,
      "shippingAddress": "123 Main St, City, Country",
      "status": "pending",
      "paymentInfo": {...},
      "createdAt": "2025-05-19T12:30:00.000Z",
      "updatedAt": "2025-05-19T12:30:00.000Z"
    },
    {...}
  ]
  ```
- **Error Responses**:
  - 500 Internal Server Error: Failed to fetch user orders

#### Get All Orders (Admin)
- **Endpoint**: GET `/api/v1/orders`
- **Purpose**: Retrieve all orders with filtering options
- **Authentication**: Required (Admin only)
- **Query Parameters**:
  - `status`: Filter by order status
  - `userId`: Filter by user
  - `startDate`: Filter by start date
  - `endDate`: Filter by end date
  - `page`: Page number for pagination
  - `limit`: Number of orders per page
- **Success Response**: 200 OK
  ```json
  {
    "orders": [...],
    "total": 50,
    "page": 1,
    "pages": 5
  }
  ```
- **Error Responses**:
  - 500 Internal Server Error: Failed to fetch orders

#### Get Order by ID
- **Endpoint**: GET `/api/v1/orders/:id`
- **Purpose**: Retrieve a specific order by ID
- **Authentication**: Required (Admin or Order Owner)
- **Success Response**: 200 OK
  ```json
  {
    "_id": "order123",
    "user": {
      "_id": "user123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [...],
    "totalAmount": 2998,
    "shippingAddress": "123 Main St, City, Country",
    "status": "pending",
    "paymentInfo": {...},
    "createdAt": "2025-05-19T12:30:00.000Z",
    "updatedAt": "2025-05-19T12:30:00.000Z"
  }
  ```
- **Error Responses**:
  - 403 Forbidden: Not authorized to view this order
  - 404 Not Found: Order not found
  - 500 Internal Server Error: Failed to get order

#### Update Order Status (Admin)
- **Endpoint**: PUT `/api/v1/orders/:id/status`
- **Purpose**: Update the status of an order
- **Authentication**: Required (Admin only)
- **Request Body**:
  ```json
  {
    "status": "in production"
  }
  ```
- **Success Response**: 200 OK
  ```json
  {
    "_id": "order123",
    "user": "user123",
    "items": [...],
    "totalAmount": 2998,
    "shippingAddress": "123 Main St, City, Country",
    "status": "in production",
    "paymentInfo": {...},
    "createdAt": "2025-05-19T12:30:00.000Z",
    "updatedAt": "2025-05-19T12:35:00.000Z"
  }
  ```
- **Error Responses**:
  - 404 Not Found: Order not found
  - 500 Internal Server Error: Failed to update order status

### Code Flow Diagram
```
Client Payment Request → Razorpay Order Creation → Client Payment Processing
    ↓
Client Order Submission → Order Validation → Save Order to Database
    ↓
Generate PDF Receipt → Send Email with Attachment → Return Order & Receipt to Client
    ↓
Admin Order Management → Status Updates → Customer Order Tracking
```

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
│   ├── pdfReceipt.util.js
│   └── generateReceipt.js
│
├── /uploads
│
├── app.js
├── server.js
└── .env
```

## 📈 Analytics System

### Overview
Lush Lilac includes a comprehensive analytics system that provides administrators with valuable insights into business performance, sales trends, and customer growth. The analytics system aggregates data from orders, users, and products to generate meaningful metrics.

### Key Metrics

1. **Order Metrics**:
   - Total order count
   - Daily revenue for the last 7 days
   - Monthly revenue for the last 12 months

2. **Customer Metrics**:
   - Total customer count
   - Customer growth over time

3. **Product Metrics**:
   - Total product count
   - Product performance

4. **Revenue Metrics**:
   - Total revenue
   - Daily and monthly revenue trends

### Analytics Implementation

The analytics system uses MongoDB's aggregation framework to process and analyze data efficiently. The implementation includes:

1. **Data Aggregation**: Utilizes MongoDB's `aggregate` pipeline to group and calculate metrics
2. **Time-Based Analysis**: Groups data by day and month for trend analysis
3. **Filtering**: Focuses on completed orders with confirmed payments
4. **Sorting**: Organizes results chronologically for trend visualization

### API Endpoint

#### Get Admin Analytics
- **Endpoint**: GET `/api/v1/analytics`
- **Purpose**: Retrieve comprehensive business analytics data
- **Authentication**: Required (Admin only)
- **Success Response**: 200 OK
  ```json
  {
    "orderCount": 150,
    "customerCount": 75,
    "productCount": 30,
    "revenue": 45000,
    "dailyRevenue": [
      {
        "_id": "2025-05-13",
        "total": 3500
      },
      {
        "_id": "2025-05-14",
        "total": 4200
      },
      // Additional days...
    ],
    "monthlyRevenue": [
      {
        "_id": "2024-06",
        "total": 12000
      },
      {
        "_id": "2024-07",
        "total": 15500
      },
      // Additional months...
    ]
  }
  ```
- **Error Responses**:
  - 401 Unauthorized: Authentication required
  - 403 Forbidden: Not an admin user
  - 500 Internal Server Error: Failed to fetch analytics

### Implementation Details

#### Daily Revenue Calculation
```javascript
// Daily Revenue - Last 7 days
const last7Days = await Order.aggregate([
  {
    $match: {
      "paymentInfo.paid": true,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      total: { $sum: "$totalAmount" },
    },
  },
  { $sort: { _id: 1 } },
]);
```

#### Monthly Revenue Calculation
```javascript
// Monthly Revenue - Last 12 months
const last12Months = await Order.aggregate([
  {
    $match: {
      "paymentInfo.paid": true,
      createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)) },
    },
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
      total: { $sum: "$totalAmount" },
    },
  },
  { $sort: { _id: 1 } },
]);
```

### Integration with Frontend

The analytics data can be integrated with frontend visualization libraries like Chart.js or D3.js to create interactive dashboards for administrators. The data structure is designed to be easily consumed by these visualization tools.

## 🎨 Artwork System

### Overview
Lush Lilac includes a custom artwork system that allows both administrators and customers to upload and manage artwork designs. These designs can be used for custom product orders or as predefined templates. The artwork system is integrated with the order process, allowing customers to associate their artwork with specific orders.

### Artwork Data Model

The Artwork model consists of:
- **Title**: Name of the artwork
- **Description**: Optional description of the artwork
- **FileUrl**: URL to the uploaded file (local or Cloudinary)
- **UploadedBy**: Reference to the user who uploaded the artwork
- **IsPredefined**: Flag indicating if the artwork is a predefined template (admin-created)
- **Timestamps**: Creation and update dates

### Detailed Workflow

#### 1. Artwork Upload
- User authenticates and accesses the artwork upload feature
- User provides a title, optional description, and selects an image file
- The file is processed by the upload middleware:
  - Validates file type (images: jpeg, png, gif, svg; videos: mp4, webm)
  - Enforces file size limits (10MB per file)
  - Stores file in the server's `/uploads` directory with a unique filename
- Artwork metadata is saved to the database with a reference to the user

#### 2. Image Processing
- For image files, the system can compress them using Sharp:
  - Resizes large images to a maximum of 1200x1200 pixels
  - Reduces JPEG quality to 80% to optimize file size
  - Maintains aspect ratio and prevents enlargement of small images

#### 3. Cloudinary Integration
- Similar to the product media workflow, artwork can be uploaded to Cloudinary:
  - Implements retry logic (up to 3 attempts) for reliable uploads
  - Handles timeouts and connection issues gracefully
  - Updates the artwork record with Cloudinary URLs after successful upload
  - Removes local files after successful cloud storage

#### 4. Artwork Management
- Users can view their uploaded artworks through dedicated endpoints
- Administrators can view all artworks or filter by predefined status
- Artwork can be deleted by the original uploader or by administrators

#### 5. Order Integration
- During the order creation process, users can select from their uploaded artworks
- The order model includes a reference to the selected artwork
- This allows for custom product creation based on user-provided designs

### API Endpoints

#### Upload Artwork
- **Endpoint**: POST `/api/v1/artworks`
- **Purpose**: Upload a new artwork file with metadata
- **Authentication**: Required
- **Request**: Multipart Form Data
  ```
  title: "Artwork Title" (required)
  description: "Artwork Description" (optional)
  isPredefined: false (optional, admin only)
  file: Image File (required)
  ```
- **Success Response**: 201 Created
  ```json
  {
    "message": "Artwork uploaded",
    "artwork": {
      "_id": "artwork123",
      "title": "My Custom Design",
      "description": "A beautiful floral pattern",
      "fileUrl": "/uploads/file-1621234567890.jpg",
      "uploadedBy": "user123",
      "isPredefined": false,
      "createdAt": "2025-05-19T12:30:00.000Z",
      "updatedAt": "2025-05-19T12:30:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Artwork file is required
  - 500 Internal Server Error: Upload failed

#### Get Artworks
- **Endpoint**: GET `/api/v1/artworks`
- **Purpose**: Retrieve all artworks or filter by predefined status
- **Authentication**: Not required
- **Query Parameters**:
  - `predefined`: Filter by predefined status (true/false)
- **Success Response**: 200 OK
  ```json
  [
    {
      "_id": "artwork123",
      "title": "My Custom Design",
      "description": "A beautiful floral pattern",
      "fileUrl": "/uploads/file-1621234567890.jpg",
      "uploadedBy": {
        "_id": "user123",
        "email": "user@example.com"
      },
      "isPredefined": false,
      "createdAt": "2025-05-19T12:30:00.000Z",
      "updatedAt": "2025-05-19T12:30:00.000Z"
    },
    {...}
  ]
  ```
- **Error Responses**:
  - 500 Internal Server Error: Failed to fetch artworks

#### Get User Artworks
- **Endpoint**: GET `/api/v1/users/artworks`
- **Purpose**: Retrieve all artworks uploaded by the authenticated user
- **Authentication**: Required
- **Success Response**: 200 OK
  ```json
  [
    {
      "_id": "artwork123",
      "title": "My Custom Design",
      "description": "A beautiful floral pattern",
      "fileUrl": "/uploads/file-1621234567890.jpg",
      "uploadedBy": "user123",
      "isPredefined": false,
      "createdAt": "2025-05-19T12:30:00.000Z",
      "updatedAt": "2025-05-19T12:30:00.000Z"
    },
    {...}
  ]
  ```
- **Error Responses**:
  - 500 Internal Server Error: Failed to get user artworks

#### Delete Artwork
- **Endpoint**: DELETE `/api/v1/artworks/:id`
- **Purpose**: Delete an artwork by ID
- **Authentication**: Required (Original uploader or Admin)
- **Success Response**: 200 OK
  ```json
  {
    "message": "Artwork deleted"
  }
  ```
- **Error Responses**:
  - 403 Forbidden: Not authorized to delete this artwork
  - 404 Not Found: Artwork not found
  - 500 Internal Server Error: Delete failed

### File Upload Implementation

The file upload process uses Multer middleware with the following configuration:

```javascript
// Configure local disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Configure multer with limits and error handling
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if the file type is acceptable
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml',
      'video/mp4', 'video/webm'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  }
});
```

### Integration with Order System

When creating an order, customers can reference their uploaded artwork:

```javascript
// Order creation with artwork reference
const newOrder = new Order({
  user: req.user._id,
  items: [...],
  totalAmount: totalAmount,
  shippingAddress: shippingAddress,
  artwork: artworkId, // Reference to the customer's artwork
  paymentInfo: {...}
});
```

### Code Flow Diagram
```
Client Upload Request → Authentication → Upload Middleware → File Storage
    ↓
Artwork Controller → Save to Database → Optional Cloudinary Upload
    ↓
User Artwork Management → Artwork Selection → Order Creation with Artwork
```

## 📩 Newsletter System

### Overview
Lush Lilac includes a newsletter subscription system that allows users to stay updated with the latest products, promotions, and news. The newsletter system provides functionality for users to subscribe and unsubscribe, and for administrators to send mass emails to all subscribers.

### Newsletter Data Model

The Newsletter model consists of:
- **Email**: Unique email address of the subscriber (required, lowercase, trimmed)
- **SubscribedAt**: Timestamp when the user subscribed (default: current date)

### Detailed Workflow

#### 1. User Subscription
- User provides their email address through a subscription form
- System validates the email format
- System checks if the email is already subscribed
- If unique, the email is added to the subscribers list
- Confirmation is sent to the user

#### 2. User Unsubscription
- User provides their email address through an unsubscribe form or link
- System verifies the email exists in the subscription list
- Email is removed from the subscribers list
- Confirmation is sent to the user

#### 3. Newsletter Distribution (Admin)
- Administrator creates newsletter content with subject and HTML body
- System retrieves all subscriber emails from the database
- Newsletter is sent to all subscribers using Nodemailer
- Each email is sent individually to protect subscriber privacy
- System provides confirmation of successful distribution

### Email Delivery System

The newsletter system uses Nodemailer with the following configuration:
1. **Transporter**: SMTP connection configured with environment variables
2. **Batch Processing**: Sends emails to multiple recipients using Promise.all for parallel processing
3. **HTML Content**: Supports rich HTML content for visually appealing newsletters
4. **Error Handling**: Robust error handling for failed email deliveries

### API Endpoints

#### Subscribe to Newsletter
- **Endpoint**: POST `/api/v1/newsletter/subscribe`
- **Purpose**: Add an email to the newsletter subscription list
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response**: 201 Created
  ```json
  {
    "message": "Subscribed successfully"
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Email is required
  - 409 Conflict: Email already subscribed
  - 500 Internal Server Error: Subscription failed

#### Unsubscribe from Newsletter
- **Endpoint**: POST `/api/v1/newsletter/unsubscribe`
- **Purpose**: Remove an email from the newsletter subscription list
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response**: 200 OK
  ```json
  {
    "message": "Unsubscribed successfully"
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Email is required
  - 404 Not Found: Email not found
  - 500 Internal Server Error: Unsubscribe failed

#### Send Newsletter (Admin)
- **Endpoint**: POST `/api/v1/newsletter/send`
- **Purpose**: Send a newsletter to all subscribers
- **Authentication**: Required (Admin only)
- **Request Body**:
  ```json
  {
    "subject": "Summer Collection Launch",
    "content": "<h1>Our Summer Collection is Here!</h1><p>Check out our latest products...</p>"
  }
  ```
- **Success Response**: 200 OK
  ```json
  {
    "message": "Newsletter sent to all subscribers"
  }
  ```
- **Error Responses**:
  - 400 Bad Request: Subject and content required or No subscribers found
  - 401 Unauthorized: Authentication required
  - 403 Forbidden: Not an admin user
  - 500 Internal Server Error: Failed to send newsletter

### Implementation Details

#### Email Validation
The system validates email format and ensures uniqueness in the database:

```javascript
// Email validation in the model
const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});
```

#### Mass Email Distribution
The system uses Promise.all for efficient parallel email sending:

```javascript
// Send emails to all subscribers
const sendPromises = subscribers.map(subscriber => {
  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to: subscriber.email,
    subject,
    html: content,
  });
});

await Promise.all(sendPromises);
```

### Integration with Frontend

The newsletter subscription form can be integrated into various parts of the frontend:
1. **Footer**: Persistent subscription form across all pages
2. **Pop-up**: Timed or exit-intent subscription prompts
3. **Dedicated Page**: Detailed newsletter subscription page with benefits
4. **Checkout**: Option to subscribe during the checkout process

### Code Flow Diagram
```
User Subscription Request → Email Validation → Duplicate Check → Database Storage
    ↓
Admin Newsletter Creation → Subscriber List Retrieval → Email Composition
    ↓
Nodmailer Configuration → Parallel Email Sending → Delivery Confirmation
```

## 📊 API Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error