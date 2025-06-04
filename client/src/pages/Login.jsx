import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../components/ui/Form";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const {
    login,
    isAuthenticated,
    error: authError,
    clearError,
    loading,
  } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    // If already authenticated, redirect to homepage or dashboard
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Sync store error to local error state for display
  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (localError) {
      setLocalError("");
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Basic client-side validation
    if (!form.email || !form.password) {
      setLocalError("Please fill in both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setLocalError("Invalid email address.");
      return;
    }

    try {
      const result = await login(form.email, form.password);
      if (!result.success) {
        setLocalError(result.error);
        setForm({ email: "", password: "" });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setLocalError(errorMessage);
      setForm({ email: "", password: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-featured-pattern dark:bg-gray-900 bg-cover bg-center relative">
      <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/90"></div>
      <div className="w-full max-w-3xl px-4 relative z-10">
        <AnimatePresence>
          {localError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {localError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <Form
          title="Login to Lush Lilac"
          fields={[
            {
              label: "Email",
              type: "email",
              name: "email",
              value: form.email,
              onChange: handleChange,
              placeholder: "Enter your email",
              autoComplete: "email",
              disabled: loading,
            },
            {
              label: "Password",
              type: "password",
              name: "password",
              value: form.password,
              onChange: handleChange,
              placeholder: "Enter your password",
              autoComplete: "current-password",
              disabled: loading,
            },
          ]}
          buttonText={loading ? "Logging in..." : "Login"}
          onSubmit={handleSubmit}
          error={localError}
          disabled={loading}
        >
          <div className="text-center mt-4">
            <a
              href="/register"
              className="text-primary dark:text-primary hover:underline"
            >
              Don't have an account? Register
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
