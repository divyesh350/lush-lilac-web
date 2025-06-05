import { motion } from 'framer-motion';

const BaseForm = ({
  title,
  subtitle,
  children,
  onSubmit,
  submitText = 'Save Changes',
  cancelText = 'Cancel',
  onCancel,
  isEditing = false,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-6 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {children}

        {isEditing && (
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {submitText}
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default BaseForm; 