import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ui/ThemeToggle";
import AuthProvider from "./providers/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import WishList from "./pages/WishList";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-bg-main text-text-primary transition-colors duration-300">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#fff",
                  color: "#6B4E71",
                  border: "1px solid #F9F0F7",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
                success: {
                  iconTheme: {
                    primary: "#6B4E71",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
            <Routes>
              
              {/* Client Routes - Inside Layout */}
              <Route path="/" element={<Layout />}>
                {/* ✅ Public Routes */}
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="payment-failure" element={<PaymentFailure />} />

                {/* ✅ Protected Routes */}
                <Route
                  path="cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="wishlist"
                  element={
                    <ProtectedRoute>
                      <WishList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* ❌ Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <ThemeToggle />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
