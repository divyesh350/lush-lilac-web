import { motion } from 'framer-motion';
import { useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';

const Form = ({ title, fields, buttonText, onSubmit, error, children }) => {
  const [showPasswords, setShowPasswords] = useState({});

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  return (
    <motion.form
      className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto"
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-dark-purple mb-6 text-center">{title}</h2>
      {fields.map(({ label, type, name, value, onChange, placeholder }) => (
        <div className="mb-4" key={name}>
          <label className="block text-medium-purple mb-2">{label}</label>
          <div className="relative">
            <input
              className="cute-input w-full py-2 px-4 rounded-full pr-10"
              type={type === 'password' ? (showPasswords[name] ? 'text' : 'password') : type}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required
            />
            {type === 'password' && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility(name)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-medium-purple hover:text-primary transition-colors"
              >
                {showPasswords[name] ? (
                  <RiEyeOffLine className="w-5 h-5" />
                ) : (
                  <RiEyeLine className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      ))}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        type="submit"
        className="bg-primary hover:bg-[#D4B6D0] text-white px-6 py-2 rounded-button w-full font-medium transition-all duration-300 btn-hover"
      >
        {buttonText}
      </button>
      {children}
    </motion.form>
  );
};

export default Form;