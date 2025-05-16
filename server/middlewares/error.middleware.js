/**
 * Global error handling middleware
 * Handles different types of errors and returns appropriate responses
 */

const errorHandler = (err, req, res, next) => {
  console.error('Global error handler caught:', err);
  
  // Handle Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: 'File upload error',
      error: err.message
    });
  }
  
  // Handle Cloudinary errors
  if (err.message && (err.message.includes('Cloudinary') || err.message.includes('upload'))) {
    return res.status(500).json({
      message: 'File storage error',
      error: err.message
    });
  }
  
  // Handle other errors
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};

module.exports = errorHandler;
