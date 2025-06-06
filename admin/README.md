# LUSH LILAC Admin Panel

A modern, responsive admin dashboard built with React, Vite, and Tailwind CSS for managing the LUSH LILAC e-commerce platform.

## 🚀 Features

### Authentication & Authorization
- Secure login system with JWT authentication
- Role-based access control (Admin, Customer)
- Protected routes and API endpoints
- Session management

### Dashboard
- Real-time analytics and statistics
- Sales overview and revenue tracking
- Recent orders and activities
- Quick access to key metrics

### Product Management
- CRUD operations for products
- Bulk product operations
- Image upload and management
- Category and subcategory management
- Inventory tracking
- Price and stock management
- Search and filter functionality
- Pagination support

### Order Management
- Order tracking and status updates
- Order history and details
- Filter and search orders
- Bulk order processing
- Export order data

### User Management
- User account management
- Role assignment
- User activity tracking
- Search and filter users
- Bulk user operations

### Category Management
- Category CRUD operations
- Subcategory management
- Category hierarchy
- Category-based product organization

### UI/UX Features
- Responsive design for all devices
- Dark/Light mode support
- Modern and clean interface
- Loading states and animations
- Toast notifications
- Confirmation dialogs
- Form validation
- Error handling

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **React Router** - Routing
- **Axios** - HTTP client

### State Management
- **Zustand** - State management
- **React Query** - Server state management

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Installation

1. Clone the repository:
```bash
git clone 
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_URL=your_api_url
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
admin/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── store/         # State management
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utility functions
│   ├── services/      # API services
│   ├── assets/        # Static assets
│   └── App.jsx        # Root component
├── public/            # Public assets
└── index.html         # Entry HTML
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📱 Responsive Design

The admin panel is fully responsive and optimized for:
- Desktop (1920px, 1440px, 1024px)
- Tablet (768px)
- Mobile (480px, 360px)

## 🔐 Security Features

- JWT-based authentication
- Protected routes
- API request interceptors
- Error boundary implementation
- Input validation
- XSS protection
- CSRF protection

## 🎨 UI Components

### Forms
- BaseForm
- FormField
- Input validation
- Error handling
- Loading states

### Tables
- BaseTable
- TableToolbar
- TablePagination
- Sortable columns
- Selectable rows
- Bulk actions

### Modals
- Confirmation dialogs
- Form modals
- Image preview
- Loading overlays

## 📈 Performance Optimization

- Code splitting
- Lazy loading
- Image optimization
- Debounced search
- Memoized components
- Optimized re-renders

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React Team
- Vite Team
- Tailwind CSS Team
- All contributors and supporters
