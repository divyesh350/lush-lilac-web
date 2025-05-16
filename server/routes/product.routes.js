const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const productController = require('../controllers/product.controller');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin only
// Wrap the upload middleware in an error handler with timeout handling
const handleUpload = (req, res, next) => {
  // Set a longer timeout for the request
  req.setTimeout(180000); // 3 minutes (default is 2 minutes)
  res.setTimeout(180000); // 3 minutes
  
  // Create a timeout handler
  const uploadTimeout = setTimeout(() => {
    console.error('Upload timed out after 3 minutes');
    return res.status(408).json({
      message: 'File upload failed',
      error: 'Upload timed out. Please try with smaller files or check your internet connection.'
    });
  }, 180000);
  
  upload.array('media', 10)(req, res, (err) => {
    // Clear the timeout since the request completed (either success or error)
    clearTimeout(uploadTimeout);
    
    if (err) {
      console.error('Upload middleware error:', err);
      return res.status(400).json({
        message: 'File upload failed',
        error: err.message
      });
    }
    next();
  });
};

router.post(
  '/',
  verifyToken,
  requireRole('admin'),
  handleUpload,
  productController.createProduct
);

router.put(
  '/:id',
  verifyToken,
  requireRole('admin'),
  upload.array('media', 10),
  productController.updateProduct
);

router.delete('/:id', verifyToken, requireRole('admin'), productController.deleteProduct);

module.exports = router;

