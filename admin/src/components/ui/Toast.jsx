import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 3000,
        style: {
          background: '#fff',
          color: '#333',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        // Success toast
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
          style: {
            borderLeft: '4px solid #10B981',
          },
        },
        // Error toast
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
          style: {
            borderLeft: '4px solid #EF4444',
          },
        },
        // Loading toast
        loading: {
          iconTheme: {
            primary: '#6366F1',
            secondary: '#fff',
          },
          style: {
            borderLeft: '4px solid #6366F1',
          },
        },
      }}
    />
  );
};

export default Toast; 