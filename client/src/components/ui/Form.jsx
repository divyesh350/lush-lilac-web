import { motion } from 'framer-motion';
import { useState } from 'react';
import { RiEyeLine, RiEyeOffLine, RiImageAddLine, RiCloseLine } from '@remixicon/react';
import Button from './Button';

const Form = ({ title, fields, buttonText, onSubmit, error, children }) => {
  const [showPasswords, setShowPasswords] = useState({});

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 rounded-md border border-[#F9F0F7] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-text-primary min-h-[100px] resize-y"
            required
          />
        );
      case 'select':
        return (
          <select
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            className="w-full px-4 py-2 rounded-md border border-[#F9F0F7] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-text-primary"
            required
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={field.name}
              checked={field.value}
              onChange={field.onChange}
              className="w-4 h-4 text-primary border-[#F9F0F7] rounded focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700"
            />
            <label className="ml-2 text-medium-purple dark:text-text-secondary">
              {field.label}
            </label>
          </div>
        );
      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="file"
              name={field.name}
              onChange={field.onChange}
              accept={field.accept}
              multiple={field.multiple}
              className="hidden"
              id={`file-${field.name}`}
            />
            <label
              htmlFor={`file-${field.name}`}
              className="inline-flex items-center px-4 py-2 border border-[#F9F0F7] dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-medium-purple dark:text-text-secondary bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <RiImageAddLine className="w-5 h-5 mr-2" />
              {field.label}
            </label>
            {field.preview && (
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {field.preview.map((file, index) => (
                  <div key={index} className="relative aspect-square">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-cover rounded-md"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => field.onRemove(index)}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'password':
        return (
          <div className="relative">
            <input
              type={showPasswords[field.name] ? 'text' : 'password'}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              placeholder={field.placeholder}
              className="w-full px-4 py-2 rounded-md border border-[#F9F0F7] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-text-primary"
              required
            />
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
          </div>
        );
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 rounded-md border border-[#F9F0F7] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-text-primary"
            required
          />
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-6">
      {title && (
        <h2 className="text-2xl font-semibold text-dark-purple dark:text-primary mb-6 text-center">
          {title}
        </h2>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className={field.type === 'checkbox' ? 'flex items-center' : ''}>
            {field.type !== 'checkbox' && field.type !== 'file' && (
              <label className="block text-medium-purple dark:text-text-secondary mb-2">
                {field.label}
              </label>
            )}
            {renderField(field)}
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