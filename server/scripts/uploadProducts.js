const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.BASE_URL) {
  console.error('ADMIN_EMAIL , ADMIN_PASSWORD and BASE_URL must be set in the environment variables');
  process.exit(1);
}
// Configuration
const config = {
  baseURL: process.env.BASE_URL, // Change this to your API base URL
  credentials: {
    email: process.env.ADMIN_EMAIL , // Will be provided
    password: process.env.ADMIN_PASSWORD // Will be provided
  }
};

// Function to generate random 6-digit number
const generateRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Function to replace [%random%] in slug with random number
const generateSlug = (slug) => {
  return slug.replace('[%random%]', generateRandomNumber());
};

// Function to get media files from the media directory
const getMediaFiles = () => {
  const mediaDir = path.join(__dirname, 'media');
  return fs.readdirSync(mediaDir)
    .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
    .map(file => path.join(mediaDir, file));
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
        formData.append('slug', generateSlug(productData[key]));
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
      contentType: 'image/png' // Adjust based on your file type
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
    const productData = JSON.parse(fs.readFileSync(path.join(__dirname, 'phone_cases.json'), 'utf8'));
    
    // Get media files
    const mediaFiles = getMediaFiles();
    console.log(`Found ${mediaFiles.length} media files`);

    // Upload each product with a media file
    for (let i = 0; i < mediaFiles.length; i++) {
      const mediaFile = mediaFiles[i];
      console.log(`\nUploading product ${i + 1}/${mediaFiles.length}`);
      console.log(`Using media file: ${path.basename(mediaFile)}`);
      
      await uploadProduct(productData, mediaFile, accessToken);
      
      // Add a small delay between uploads to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 20000)); // 20 seconds delay
    }

    console.log('\nAll products uploaded successfully!');
  } catch (error) {
    console.error('Script failed:', error.message);
    process.exit(1);
  }
};

// Run the script
uploadAllProducts(); 