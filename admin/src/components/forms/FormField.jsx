const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder = '',
  options = [],
  rows = 4,
  className = '',
}) => {
  const inputClasses = "w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-gray-50";

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            rows={rows}
            className={inputClasses}
          />
        );
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={inputClasses}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            name={name}
            checked={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
        );
      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className={inputClasses}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <label className={`flex items-center gap-2 ${className}`}>
        {renderInput()}
        <span className="text-gray-700">{label}</span>
      </label>
    );
  }

  return (
    <div className={className}>
      <label className="block text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
    </div>
  );
};

export default FormField; 