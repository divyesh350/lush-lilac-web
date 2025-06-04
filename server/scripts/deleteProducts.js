const axios = require('axios');

// Configuration
const config = {
  baseURL: 'http://localhost:5000/api/v1', // Change this to your API base URL
  credentials: {
    email: 'admin@admin.com', // Will be provided
    password: 'admin' // Will be provided
  }
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

// Function to get all products of a specific category
const getProductsByCategory = async (category, accessToken) => {
  try {
    const response = await axios.get(`${config.baseURL}/products?category=${category}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data.products;
  } catch (error) {
    console.error('Failed to fetch products:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Function to delete a single product
const deleteProduct = async (productId, accessToken) => {
  try {
    await axios.delete(`${config.baseURL}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return true;
  } catch (error) {
    console.error(`Failed to delete product ${productId}:`, error.response?.data?.message || error.message);
    return false;
  }
};

// Main function to delete products by category
const deleteProductsByCategory = async (category) => {
  try {
    // Login and get tokens
    const { accessToken } = await login();
    console.log('Login successful');

    // Get all products of the specified category
    console.log(`\nFetching products with category: ${category}`);
    const products = await getProductsByCategory(category, accessToken);
    console.log(`Found ${products.length} products to delete`);

    if (products.length === 0) {
      console.log('No products found to delete');
      return;
    }

    // Confirm deletion
    console.log('\nProducts to be deleted:');
    products.forEach(product => {
      console.log(`- ${product.title} (${product._id})`);
    });

    // Ask for confirmation
    console.log('\nAre you sure you want to delete these products? (yes/no)');
    process.stdin.once('data', async (data) => {
      const answer = data.toString().trim().toLowerCase();
      
      if (answer === 'yes') {
        console.log('\nDeleting products...');
        let successCount = 0;
        let failCount = 0;

        // Delete each product
        for (const product of products) {
          console.log(`\nDeleting product: ${product.title}`);
          const success = await deleteProduct(product._id, accessToken);
          
          if (success) {
            successCount++;
            console.log(`Successfully deleted: ${product.title}`);
          } else {
            failCount++;
            console.log(`Failed to delete: ${product.title}`);
          }

          // Add a small delay between deletions
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Show summary
        console.log('\nDeletion Summary:');
        console.log(`Successfully deleted: ${successCount} products`);
        console.log(`Failed to delete: ${failCount} products`);
      } else {
        console.log('Deletion cancelled');
      }
      
      process.exit(0);
    });

  } catch (error) {
    console.error('Script failed:', error.message);
    process.exit(1);
  }
};

// Get category from command line argument
const category = process.argv[2];

if (!category) {
  console.error('Please provide a category as a command line argument');
  console.log('Usage: node deleteProducts.js <category>');
  process.exit(1);
}

// Run the script
deleteProductsByCategory(category); 