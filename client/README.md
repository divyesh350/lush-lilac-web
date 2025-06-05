# Lush Lilac - Frontend Application

## 🚀 Project Overview
Lush Lilac's frontend is a modern, responsive e-commerce platform built with React and Vite. The application provides a seamless shopping experience with features like user authentication, product browsing, cart management, and secure checkout.

## 🛠️ Tech Stack
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
- **Build Tool**: Vite

## 📦 Dependencies
```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@mui/material": "^7.1.0",
    "@mui/styled-engine-sc": "^7.1.0",
    "@remixicon/react": "^4.6.0",
    "axios": "^1.9.0",
    "framer-motion": "^12.12.1",
    "js-cookie": "^3.0.5",
    "react": "^19.1.0",
    "react-confetti": "^6.4.0",
    "react-dom": "^19.1.0",
    "react-hot-toast": "^2.5.2",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.6.0",
    "styled-components": "^6.1.18",
    "tailwindcss": "^3.4.17",
    "zustand": "^5.0.4"
  }
}
```

## 🏗️ Project Structure
```
src/
├── api/          # API integration and services
├── assets/       # Static assets (images, fonts, etc.)
├── components/   # Reusable UI components
├── context/      # React context providers
├── hooks/        # Custom React hooks
├── pages/        # Page components
├── providers/    # Application providers
├── store/        # Zustand store configuration
├── utils/        # Utility functions
├── App.jsx       # Main application component
├── main.jsx      # Application entry point
└── index.css     # Global styles
```

## 🔄 Application Flow

### 1. Authentication Flow
```
User Action → Auth Store → API Request → Token Management → Protected Routes
```

### 2. Product Browsing Flow
```
User Search/Filter → Product Store → API Request → UI Update → Cart Integration
```

### 3. Cart Management Flow
```
Add to Cart → Cart Store → Local Storage → Checkout Process → Order Creation
```

### 4. Checkout Flow
```
Cart Review → Address Selection → Payment Processing → Order Confirmation
```

## 🎨 Design Features

### 1. UI Components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Material Design**: MUI components for consistent UI
- **Custom Components**: 
  - Product cards
  - Cart items
  - Order summaries
  - Custom form inputs
  - Loading skeletons

### 2. Animations
- **Page Transitions**: Smooth route transitions
- **Micro-interactions**: 
  - Button hover effects
  - Cart item animations
  - Success/error notifications
  - Loading states

### 3. Theme System
- **Color Palette**: Custom color scheme
- **Typography**: Consistent font hierarchy
- **Dark Mode**: System preference detection
- **Responsive Breakpoints**: Mobile, tablet, desktop

## 📱 State Management

### 1. Zustand Stores
- **Auth Store**: User authentication state
- **Cart Store**: Shopping cart management
- **Product Store**: Product listing and filtering
- **UI Store**: Application UI state

### 2. Store Structure
```javascript
// Example Store
const useStore = create((set) => ({
  state: initialState,
  actions: {
    updateState: (newState) => set({ state: newState }),
    // Additional actions
  }
}));
```

## 🔐 Authentication System

### 1. Token Management
- JWT token storage in HTTP-only cookies
- Automatic token refresh
- Protected route implementation

### 2. User Roles
- Customer access
- Admin dashboard
- Role-based route protection

## 🛍️ Shopping Features

### 1. Product Browsing
- Category-based navigation
- Search functionality
- Filter and sort options
- Product variants selection

### 2. Cart System
- Persistent cart storage
- Real-time price updates
- Quantity management
- Cart item customization

### 3. Checkout Process
- Address management
- Payment method selection
- Order summary
- Confirmation flow

## 📦 Build & Development

### 1. Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Production
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### 3. Linting
```bash
# Run ESLint
npm run lint
```


## 🔧 Configuration Files

### 1. Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

### 2. Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Custom theme configuration
    }
  },
  plugins: []
};
```

## 🚀 Performance Optimization

### 1. Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports

### 2. Asset Optimization
- Image optimization
- Font loading strategies
- CSS optimization

### 3. Caching
- Service worker implementation
- Local storage strategies
- API response caching

## 📱 Responsive Design

### 1. Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### 2. Mobile Features
- Touch-friendly interfaces
- Mobile-optimized navigation
- Responsive images

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
