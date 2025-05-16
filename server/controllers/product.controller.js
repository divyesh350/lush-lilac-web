const Product = require('../models/Product');
const { uploadProductMediaToCloudinary } = require('../utils/cloudinaryUploader');

exports.createProduct = async (req, res) => {
  try {
    
    if (!req.body.title || !req.body.description || !req.body.price || !req.body.variants) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        error: 'Please provide title, description, price, and variants'
      });
    }

    const { title, description, price, variants } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No media files uploaded',
        error: 'Please upload at least one media file'
      });
    }

    // Prepare minimal media information for Cloudinary upload
    let media = [];
    if (req.files && Array.isArray(req.files)) {
      media = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        type: file.mimetype ? (file.mimetype.startsWith('video') ? 'video' : 'image') : 'image',
        public_id: file.filename || 'unknown',
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }));
    }

    let parsedVariants;
    try {
      // Check if variants is already an object (might be auto-parsed by Express)
      if (typeof variants === 'object' && variants !== null) {
        parsedVariants = variants;
      } else if (typeof variants === 'string') {
        parsedVariants = JSON.parse(variants);
      } else {
        throw new Error('Variants must be provided as a string or object');
      }
      
      // Ensure it's an array
      if (!Array.isArray(parsedVariants)) {
        // If it's not an array but an object, try to convert it to an array
        if (typeof parsedVariants === 'object') {
          parsedVariants = [parsedVariants];
        } else {
          throw new Error('Variants must be an array or object');
        }
      }
    } catch (parseErr) {
      console.error('Variants parsing error:', parseErr, 'Variants value:', variants);
      return res.status(400).json({
        message: 'Invalid variants format',
        error: 'Variants must be a valid JSON array or object'
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      variants: parsedVariants,
      media,
    });

    // Respond to the client immediately
    res.status(201).json(product);
    
    // Upload media to Cloudinary in the background
    uploadProductMediaToCloudinary(product._id)
      .catch(error => console.error('Background upload error:', error));
  } catch (err) {
    res.status(500).json({ 
      message: 'Product creation failed',
      error: err.message || 'An unexpected error occurred'
    });
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, variants } = req.body;

    const media = req.files?.map((file) => ({
      url: file.path,
      type: file.mimetype.startsWith('video') ? 'video' : 'image',
      public_id: file.filename,
    }));

    const parsedVariants = variants ? JSON.parse(variants) : undefined;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price }),
        ...(parsedVariants && { variants: parsedVariants }),
        ...(media && { $push: { media: { $each: media } } }),
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });

  const cloudinary = require('../utils/cloudinary');
  for (let media of product.media) {
    await cloudinary.uploader.destroy(media.public_id, {
      resource_type: media.type === 'video' ? 'video' : 'image',
    });
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};
