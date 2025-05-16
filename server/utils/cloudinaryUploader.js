const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const sharp = require('sharp');

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Path to the file
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Object>} - Cloudinary upload result
 */
/**
 * Compress an image file to reduce its size
 * @param {string} inputPath - Path to the input file
 * @param {string} outputPath - Path to save the compressed file
 * @returns {Promise<string>} - Path to the compressed file
 */
const compressImage = async (inputPath, outputPath) => {
  try {
    // Get file extension
    const ext = path.extname(inputPath).toLowerCase();
    
    // Only compress images, not videos
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      return inputPath; // Return original path for non-images
    }
    
    // Compress the image
    await sharp(inputPath)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }) // Resize if larger than 1200x1200
      .jpeg({ quality: 80 }) // Reduce quality to 80%
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    // Return original path if compression fails
    return inputPath;
  }
};

/**
 * Upload a file to Cloudinary with retry logic
 * @param {string} filePath - Path to the file
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder = 'products') => {
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Compress the image before uploading
    const compressedPath = `${filePath}.compressed${path.extname(filePath)}`;
    const fileToUpload = await compressImage(filePath, compressedPath);
    
    // Upload with retry logic
    let retries = 3;
    let lastError = null;
    
    while (retries > 0) {
      try {
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(fileToUpload, {
          folder,
          resource_type: 'auto',
          timeout: 60000, // 1 minute timeout per attempt
        });
        
        // Clean up compressed file if it's different from original
        if (fileToUpload !== filePath && fs.existsSync(fileToUpload)) {
          fs.unlinkSync(fileToUpload);
        }
        
        return result;
      } catch (uploadError) {
        lastError = uploadError;
        retries--;
        
        if (retries > 0) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    // If we get here, all retries failed
    throw lastError || new Error('All upload attempts failed');
  } catch (error) {
    throw error;
  }
};

/**
 * Upload product media to Cloudinary and update the product
 * @param {string} productId - Product ID
 */
const uploadProductMediaToCloudinary = async (productId) => {
  try {
    // Get the product
    const product = await Product.findById(productId);
    if (!product) {
      return;
    }

    // Process media files for product

    // Upload each media file to Cloudinary
    const updatedMedia = [];
    for (const media of product.media) {
      try {
        // Get the file path from the URL
        const filename = path.basename(media.url);
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          updatedMedia.push(media); // Keep the original media
          continue;
        }
        
        // Upload to Cloudinary
        const result = await uploadToCloudinary(filePath, 'products');
        
        // Add the Cloudinary URL to the media
        updatedMedia.push({
          url: result.secure_url,
          type: media.type,
          public_id: result.public_id,
          originalname: media.originalname,
          size: media.size,
          mimetype: media.mimetype,
          cloudinary: true
        });
        
        // Delete the local file after successful upload
        try {
          fs.unlinkSync(filePath);
        } catch (deleteError) {
          // Silently continue if file deletion fails
        }
      } catch (error) {
        updatedMedia.push(media); // Keep the original media if upload fails
      }
    }
    
    // Update the product with Cloudinary URLs
    const updatedProduct = await Product.findByIdAndUpdate(productId, { media: updatedMedia }, { new: true });
    
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  uploadProductMediaToCloudinary
};
