const Product = require('../models/Product');
const { uploadProductMediaToCloudinary } = require('../utils/cloudinaryUploader');

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      basePrice,
      variants,
      codAvailable,
      customizable,
      personalizationInstructions,
      category,
      slug,
      isFeatured,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      basePrice === undefined ||
      !variants
    ) {
      return res.status(400).json({
        message: 'Missing required fields',
        error: 'Please provide title, description, basePrice, and variants',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No media files uploaded',
        error: 'Please upload at least one media file',
      });
    }

    // Prepare media info as before
    let media = [];
    if (req.files && Array.isArray(req.files)) {
      media = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        type: file.mimetype ? (file.mimetype.startsWith('video') ? 'video' : 'image') : 'image',
        public_id: file.filename || 'unknown',
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      }));
    }

    // Parse variants from string if needed
    let parsedVariants;
    try {
      if (typeof variants === 'object' && variants !== null) {
        parsedVariants = variants;
      } else if (typeof variants === 'string') {
        parsedVariants = JSON.parse(variants);
      } else {
        throw new Error('Variants must be provided as a string or object');
      }
      if (!Array.isArray(parsedVariants)) {
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
        error: 'Variants must be a valid JSON array or object',
      });
    }

    const product = await Product.create({
      title,
      description,
      basePrice,
      variants: parsedVariants,
      media,
      codAvailable,
      customizable,
      personalizationInstructions: personalizationInstructions || '',
      category: category || '',
      slug: slug || '',
      isFeatured,
    });

    res.status(201).json(product);

    // Upload media to Cloudinary async (unchanged)
    uploadProductMediaToCloudinary(product._id).catch((error) =>
      console.error('Background upload error:', error)
    );
  } catch (err) {
    res.status(500).json({
      message: 'Product creation failed',
      error: err.message || 'An unexpected error occurred',
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      size,
      color,
      material,
      minPrice,
      maxPrice,
      category,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Search by product title (corrected from 'name')
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Variant filters
    if (size || color || material) {
      query.variants = {
        $elemMatch: {},
      };
      if (size) query.variants.$elemMatch.size = size;
      if (color) query.variants.$elemMatch.color = color;
      if (material) query.variants.$elemMatch.material = material;
    }

    // Price filtering — variants have their own price property now
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

    // Pagination
    const skip = (page - 1) * limit;

    // Find products
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
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      title,
      description,
      basePrice,
      variants,
      customizable,
      personalizationInstructions,
      category,
      slug,
      codAvailable,
      isFeatured,
      isActive,
    } = req.body;

    // Prepare new media info (unchanged)
    let newMedia = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      newMedia = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        type: file.mimetype ? (file.mimetype.startsWith('video') ? 'video' : 'image') : 'image',
        public_id: file.filename || 'unknown',
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
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
          error: 'Variants must be a valid JSON array or object',
        });
      }
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(basePrice !== undefined && { basePrice }),
        ...(parsedVariants && { variants: parsedVariants }),
        ...(typeof customizable !== 'undefined' && { customizable }),
        ...(personalizationInstructions !== undefined && { personalizationInstructions }),
        ...(category !== undefined && { category }),
        ...(slug !== undefined && { slug }),
        ...(codAvailable !== undefined && { codAvailable }),
        ...(newMedia.length > 0 && { $push: { media: { $each: newMedia } } }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    );

    res.json(updated);

    if (newMedia.length > 0) {
      uploadProductMediaToCloudinary(updated._id).catch((error) =>
        console.error('Background upload error:', error)
      );
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

    // Delete media from Cloudinary if flagged (unchanged)
    for (let media of product.media) {
      if (media.cloudinary && media.public_id) {
        try {
          await cloudinary.uploader.destroy(media.public_id, {
            resource_type: media.type === 'video' ? 'video' : 'image',
          });
        } catch (cloudinaryError) {
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

exports.getFeaturedProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Find featured products with pagination and ensure they are active
    const products = await Product.find({ 
      isFeatured: true,
      isActive: true 
    })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Sort by newest first

    // Get total count of featured products
    const total = await Product.countDocuments({ 
      isFeatured: true,
      isActive: true 
    });

    res.json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch featured products', 
      error: error.message 
    });
  }
};
