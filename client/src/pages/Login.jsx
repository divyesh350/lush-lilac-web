import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/ui/Form';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error: authError, clearError } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clear any previous errors
    clearError();
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, clearError]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async e => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-featured-pattern bg-cover">
      <div className="w-full max-w-3xl px-4">
        <Form
          title="Login to Lush Lilac"
          fields={[
            { label: 'Email', type: 'email', name: 'email', value: form.email, onChange: handleChange, placeholder: 'Enter your email' },
            { label: 'Password', type: 'password', name: 'password', value: form.password, onChange: handleChange, placeholder: 'Enter your password' }
          ]}
          buttonText={isSubmitting ? "Logging in..." : "Login"}
          onSubmit={handleSubmit}
          error={error || authError}
        >
          <div className="text-center mt-4">
            <a href="/register" className="text-primary hover:underline">Don't have an account? Register</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;