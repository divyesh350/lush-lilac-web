const cloudinary = require('cloudinary').v2;

// Check if environment variables are set
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary environment variables are missing!');
  console.error('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing');
  console.error('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
  console.error('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');
  throw new Error('Cloudinary configuration is incomplete. Please check your .env file.');
}

try {
  // Configure cloudinary with extended timeout and debugging
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 180000, // 3 minutes timeout (default is 60 seconds)
  });
  
  // Test the Cloudinary configuration
  console.log('Testing Cloudinary connection...');
  cloudinary.api.ping((error, result) => {
    if (error) {
      console.error('Cloudinary connection test failed:', error);
    } else {
      console.log('Cloudinary connection successful:', result);
    }
  });
  
  console.log('Cloudinary configured with the following settings:');
  console.log('- Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('- API key:', process.env.CLOUDINARY_API_KEY ? '****' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'Missing');
  console.log('- Timeout:', '180000ms (3 minutes)');
} catch (error) {
  console.error('Error configuring Cloudinary:', error);
  throw error; // Re-throw to prevent the app from starting with invalid configuration
}

module.exports = cloudinary;
    
