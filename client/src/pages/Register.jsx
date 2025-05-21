import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/ui/Form';
import useAuthStore from '../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, error: authError, clearError } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

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
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-featured-pattern bg-cover">
      <div className="w-full max-w-3xl px-4">
        <Form
          title="Create Your Account"
          fields={[
            { label: 'Name', type: 'text', name: 'name', value: form.name, onChange: handleChange, placeholder: 'Enter your name' },
            { label: 'Email', type: 'email', name: 'email', value: form.email, onChange: handleChange, placeholder: 'Enter your email' },
            { label: 'Password', type: 'password', name: 'password', value: form.password, onChange: handleChange, placeholder: 'Create a password' },
            { label: 'Confirm Password', type: 'password', name: 'confirmPassword', value: form.confirmPassword, onChange: handleChange, placeholder: 'Confirm your password' }
          ]}
          buttonText="Register"
          onSubmit={handleSubmit}
          error={error || authError}
        >
          <div className="text-center mt-4">
            <a href="/login" className="text-primary hover:underline">Already have an account? Login</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;