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

exports.getProducts = async (req, res) => {
  try {
    const {
      search,           // string to search in product name
      size,             // variant size filter
      color,            // variant color filter
      material,         // variant material filter
      minPrice,         // minimum price filter
      maxPrice,         // maximum price filter
      page = 1,         // page number for pagination (default 1)
      limit = 10,       // items per page (default 10)
    } = req.query;

    const query = {};

    // Search by product name (case-insensitive partial match)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Variant filters - we'll check if any variant matches these filters
    if (size || color || material) {
      query.variants = {
        $elemMatch: {},
      };

      if (size) query.variants.$elemMatch.size = size;
      if (color) query.variants.$elemMatch.color = color;
      if (material) query.variants.$elemMatch.material = material;
    }

    // Price filter (price is stored per variant, so filter variants price)
    if (minPrice || maxPrice) {
      if (!query.variants) query.variants = { $elemMatch: {} };

      if (minPrice) query.variants.$elemMatch.price = { $gte: Number(minPrice) };
      if (maxPrice) {
        query.variants.$elemMatch.price = {
          ...query.variants.$elemMatch.price,
          $lte: Number(maxPrice),
        };
      }
    }

    // Pagination calculations
    const skip = (page - 1) * limit;

    // Query products from DB
    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit));

    // Total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  try {
    // First, get the existing product to preserve existing data
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const { title, description, price, variants } = req.body;

    // Prepare media information for new uploads
    let newMedia = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      newMedia = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        type: file.mimetype ? (file.mimetype.startsWith('video') ? 'video' : 'image') : 'image',
        public_id: file.filename || 'unknown',
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }));
    }

    // Parse variants if provided
    let parsedVariants;
    if (variants) {
      try {
        parsedVariants = typeof variants === 'object' ? variants : JSON.parse(variants);
      } catch (error) {
        return res.status(400).json({
          message: 'Invalid variants format',
          error: 'Variants must be a valid JSON array or object'
        });
      }
    }

    // Update the product with new information
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price }),
        ...(parsedVariants && { variants: parsedVariants }),
        ...(newMedia.length > 0 && { $push: { media: { $each: newMedia } } }),
      },
      { new: true }
    );

    // Respond to the client immediately
    res.json(updated);
    
    // Upload new media to Cloudinary in the background if there are new files
    if (newMedia.length > 0) {
      uploadProductMediaToCloudinary(updated._id)
        .catch(error => console.error('Background upload error:', error));
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });

    const cloudinary = require('../config/cloudinary');
    
    // Delete media from Cloudinary if cloudinary flag is true
    for (let media of product.media) {
      if (media.cloudinary && media.public_id) {
        try {
          await cloudinary.uploader.destroy(media.public_id, {
            resource_type: media.type === 'video' ? 'video' : 'image',
          });
        } catch (cloudinaryError) {
          // Continue even if Cloudinary deletion fails
          console.error('Error deleting from Cloudinary:', cloudinaryError.message);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};
