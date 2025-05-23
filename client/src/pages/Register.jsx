import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/ui/Form';
import { useAuthStore } from '../store/useAuthStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, error: authError, clearError, isLoading } = useAuthStore();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Sync global auth error to local error state
  useEffect(() => {
    if (authError) {
      setLocalError(authError);
    }
  }, [authError]);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (localError) {
      setLocalError('');
      clearError();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLocalError('');

    // Basic client-side validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setLocalError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if(form.password.length < 6){
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function isValidEmail(email) {
      return emailRegex.test(email);
    }
    if (!isValidEmail(form.email)) {
      setLocalError('Invalid email address.');
      return;
    }
    const { name, email, password } = form;
    const result = await register({ name, email, password });

    if (!result.success) {
      setLocalError(result.error || 'Registration failed. Please try again.');
    }
    // On success, user will be redirected by the effect above
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-featured-pattern dark:bg-gray-900 bg-cover bg-center relative">
      <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/90"></div>
      <div className="w-full max-w-3xl px-4 relative z-10">
        <Form
          title="Create Your Account"
          fields={[
            { label: 'Name', type: 'text', name: 'name', value: form.name, onChange: handleChange, placeholder: 'Enter your name', autoComplete: 'name' },
            { label: 'Email', type: 'email', name: 'email', value: form.email, onChange: handleChange, placeholder: 'Enter your email', autoComplete: 'email' },
            { label: 'Password', type: 'password', name: 'password', value: form.password, onChange: handleChange, placeholder: 'Create a password', autoComplete: 'new-password' },
            { label: 'Confirm Password', type: 'password', name: 'confirmPassword', value: form.confirmPassword, onChange: handleChange, placeholder: 'Confirm your password', autoComplete: 'new-password' }
          ]}
          buttonText={isLoading ? 'Registering...' : 'Register'}
          onSubmit={handleSubmit}
          error={localError}
          disabled={isLoading}
        >
          <div className="text-center mt-4">
            <a href="/login" className="text-primary dark:text-primary hover:underline">Already have an account? Login</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
