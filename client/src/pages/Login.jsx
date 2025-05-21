import { useState } from 'react';
import Form from '../components/ui/Form';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // Handle login logic here
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
          buttonText="Login"
          onSubmit={handleSubmit}
          error={error}
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