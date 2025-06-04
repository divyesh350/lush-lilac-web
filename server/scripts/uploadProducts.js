const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configuration
const config = {
  baseURL: 'http://localhost:5000/api/v1', // Change this to your API base URL
  credentials: {
    email: 'admin@admin.com', // Will be provided
    password: 'admin' // Will be provided
  }
};

// Function to generate random 6-digit number
const generateRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Function to generate a unique slug from product title
const generateSlug = (title) => {
  // Convert title to lowercase and replace spaces with hyphens
  const baseSlug = title.toLowerCase().replace(/\s+/g, '-');
  // Add random number to ensure uniqueness
  return `${baseSlug}-${generateRandomNumber()}`;
};

// Function to get media files from the media directory
const getMediaFiles = () => {
  const mediaDir = path.join(__dirname, 'media');
  return fs.readdirSync(mediaDir)
    .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
    .map(file => path.join(mediaDir, file));
};

// Function to find matching image for a product
const findMatchingImage = (productTitle, mediaFiles) => {
  // Convert product title to lowercase and replace spaces with hyphens
  const normalizedTitle = productTitle.toLowerCase().replace(/\s+/g, '-');
  
  // Try to find exact match first
  let matchingFile = mediaFiles.find(file => {
    const fileName = path.basename(file, path.extname(file));
    return fileName === normalizedTitle;
  });

  // If no exact match, try partial match
  if (!matchingFile) {
    matchingFile = mediaFiles.find(file => {
      const fileName = path.basename(file, path.extname(file));
      return fileName.includes(normalizedTitle) || normalizedTitle.includes(fileName);
    });
  }

  return matchingFile;
};

// Function to login and get tokens
const login = async () => {
  try {
    const response = await axios.post(`${config.baseURL}/auth/login`, config.credentials);
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Function to upload a single product
const uploadProduct = async (productData, mediaFile, accessToken) => {
  try {
    const formData = new FormData();
    
    // Add product data
    Object.keys(productData).forEach(key => {
      if (key === 'variants') {
        // Convert variants array to string before appending
        formData.append('variants', JSON.stringify(productData[key]));
      } else if (key === 'slug') {
        // Generate unique slug from title
        formData.append('slug', generateSlug(productData.title));
      } else if (key !== 'media') { // Skip the media array from JSON
        // Convert boolean values to strings
        if (typeof productData[key] === 'boolean') {
          formData.append(key, productData[key].toString());
        } else {
          formData.append(key, productData[key]);
        }
      }
    });

    // Add media file with proper field name
    formData.append('media', fs.createReadStream(mediaFile), {
      filename: path.basename(mediaFile),
      contentType: 'image/jpeg' // Adjust based on your file type
    });

    const response = await axios.post(`${config.baseURL}/products`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${accessToken}`
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    console.log(`Product uploaded successfully: ${response.data.title}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    console.error('Failed to upload product:', error.message);
    throw error;
  }
};

// Main function to upload all products
const uploadAllProducts = async () => {
  try {
    // Login and get tokens
    const { accessToken } = await login();
    console.log('Login successful');

    // Read product data
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'candles.json'), 'utf8'));
    
    // Get media files
    const mediaFiles = getMediaFiles();
    console.log(`Found ${mediaFiles.length} media files`);

    // Track products without images
    const productsWithoutImages = [];

    // Upload each product with its matching media file
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`\nProcessing product ${i + 1}/${products.length}: ${product.title}`);
      
      // Find matching image for the product
      const matchingImage = findMatchingImage(product.title, mediaFiles);
      
      if (matchingImage) {
        console.log(`Found matching image: ${path.basename(matchingImage)}`);
        try {
          await uploadProduct(product, matchingImage, accessToken);
        } catch (error) {
          console.error(`Failed to upload product: ${product.title}`);
          continue; // Continue with next product if upload fails
        }
      } else {
        console.error(`No matching image found for product: ${product.title}`);
        productsWithoutImages.push(product.title);
      }
      
      // Add a small delay between uploads to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 20000)); // 20 seconds delay
    }

    // Report products without images
    if (productsWithoutImages.length > 0) {
      console.log('\nProducts without matching images:');
      productsWithoutImages.forEach(title => console.log(`- ${title}`));
    }

    console.log('\nAll products processed!');
  } catch (error) {
    console.error('Script failed:', error.message);
    process.exit(1);
  }
};

// Run the script
uploadAllProducts(); 