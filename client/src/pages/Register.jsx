import { useState } from 'react';
import Form from '../components/ui/Form';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Handle register logic here
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
          error={error}
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