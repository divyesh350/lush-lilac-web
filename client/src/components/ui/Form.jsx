import { motion } from 'framer-motion';
import { useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import Button from './Button';

const Form = ({ title, fields, buttonText, onSubmit, error, children }) => {
  const [showPasswords, setShowPasswords] = useState({});

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-dark-purple dark:text-primary mb-6 text-center">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-medium-purple dark:text-text-secondary mb-2">{field.label}</label>
            <div className="relative">
              <input
                type={field.type === 'password' ? (showPasswords[field.name] ? 'text' : 'password') : field.type}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 rounded-lg border border-[#F9F0F7] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-text-primary"
                required
              />
              {field.type === 'password' && (
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.name)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-medium-purple hover:text-primary transition-colors"
                >
                  {showPasswords[field.name] ? (
                    <RiEyeLine className="w-5 h-5" />
                  ) : (
                    <RiEyeOffLine className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>
        )}
        <Button type="submit" className="w-full">
          {buttonText}
        </Button>
      </form>
      {children}
    </div>
  );
};

export default Form;