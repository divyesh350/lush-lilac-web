# Lush Lilac - MERN Stack E-commerce Platform

## 🚀 Project Overview
Lush Lilac is a modern e-commerce platform built with the MERN (MongoDB, Express.js, React.js, Node.js) stack. The platform offers a seamless shopping experience with features like user authentication, product management, custom artwork integration, and secure payment processing.

## 🛠️ Tech Stack

### Backend
- **Framework**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (Access & Refresh Tokens)
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer
- **Payment Gateway**: Razorpay
- **Payment Methods**: Online Payment (Razorpay), Cash on Delivery (COD)

### Frontend
- **Framework**: React 19 with Vite
- **State Management**: Zustand
- **Routing**: React Router DOM v7
- **UI Components**: Material-UI (MUI) v7
- **Styling**: 
  - Tailwind CSS
  - Styled Components
  - Emotion
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons & Remix Icon

## 📦 Project Structure

### Backend Structure
```
server/
├── config/         # Configuration files
├── controllers/    # Business logic
├── models/         # MongoDB schemas
├── routes/         # API routes
├── middlewares/    # Custom middleware
├── utils/          # Utility functions
├── uploads/        # File uploads
├── app.js          # Express app setup
└── server.js       # Server entry point
```

### Frontend Structure
```
client/
├── src/
│   ├── api/        # API integration
│   ├── assets/     # Static assets
│   ├── components/ # Reusable components
│   ├── context/    # React context
│   ├── hooks/      # Custom hooks
│   ├── pages/      # Page components
│   ├── providers/  # App providers
│   ├── store/      # Zustand stores
│   ├── utils/      # Utility functions
│   ├── App.jsx     # Main component
│   └── main.jsx    # Entry point
```

## 🔄 Application Workflow

### 1. User Authentication Flow
```
Frontend:
User Action → Auth Store → API Request → Token Management → Protected Routes

Backend:
Request → Rate Limiter → Auth Middleware → Controller → Response
```

### 2. Product Management Flow
```
Frontend:
User Search/Filter → Product Store → API Request → UI Update → Cart Integration

Backend:
Request → Validation → Product Controller → Database → Response
```

### 3. Order Processing Flow
```
Frontend:
Cart Review → Address Selection → Payment Processing → Order Confirmation

Backend:
Request → Payment Processing → Order Creation → Email Notification → Response
```

### 4. Artwork Integration Flow
```
Frontend:
Artwork Upload → Preview → Customization → Order Integration

Backend:
Request → Multer Middleware → Cloudinary Upload → Database Update → Response
```

## 🛡️ Security Features

### 1. Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control
- Secure password hashing
- Rate limiting for sensitive routes

### 2. Data Protection
- Input validation and sanitization
- XSS protection
- CSRF protection
- MongoDB query sanitization

### 3. Payment Security
- Secure payment processing with Razorpay
- SSL/TLS encryption
- Secure cookie handling
- Payment verification

## 🎨 Design Features

### 1. UI Components
- Responsive design with Tailwind CSS
- Material Design components
- Custom product cards and forms
- Loading skeletons

### 2. User Experience
- Smooth page transitions
- Micro-interactions
- Toast notifications
- Loading states

### 3. Theme System
- Custom color palette
- Consistent typography
- Dark mode support
- Responsive breakpoints

## 💳 Payment System

### 1. Online Payment (Razorpay)
- Secure payment gateway integration
- Multiple payment methods
- Payment verification
- Order confirmation

### 2. Cash on Delivery (COD)
- Product-level COD availability
- Order verification
- Delivery tracking
- Payment collection

## 📧 Communication System

### 1. Email Notifications
- Order confirmations
- Payment receipts
- Status updates
- Newsletter distribution

### 2. PDF Generation
- Order receipts
- Invoice generation
- Custom artwork proofs

## 📊 Analytics System

### 1. Sales Analytics
- Revenue tracking
- Product performance
- Order statistics
- Customer insights

### 2. User Analytics
- User behavior tracking
- Conversion rates
- Page performance
- Error monitoring

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- Razorpay account

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/divyesh350/lush-lilac-web.git

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Setup
Create `.env` files in both server and client directories with required variables.

### 4. Running the Application
```bash
# Start backend server
cd server
npm run dev

# Start frontend development server
cd ../client
npm run dev
```

## 🧪 Testing
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd ../client
npm test
```

## 📱 Mobile Responsiveness
- Mobile-first design approach
- Responsive breakpoints
- Touch-friendly interfaces
- Optimized images


## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License
This project is licensed under the MIT License.

## 👥 Author
- **Name**: Divyesh Bakaraniya
- **GitHub**: https://github.com/divyesh350
