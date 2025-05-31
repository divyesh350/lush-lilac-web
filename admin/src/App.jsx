import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminLayout from './layouts/AdminLayout';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Products = lazy(() => import('./pages/admin/Products'));
const ProductDetails = lazy(() => import('./pages/admin/ProductDetails'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Users = lazy(() => import('./pages/admin/Users'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const Newsletter = lazy(() => import('./pages/admin/Newsletter'));
const Artwork = lazy(() => import('./pages/admin/Artwork'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="artwork" element={<Artwork />} />
          </Route>
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
