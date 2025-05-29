import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  useTheme,
  IconButton,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { RiAddLine, RiCloseLine, RiEyeLine, RiImageAddLine } from 'react-icons/ri';
import DataTable from '../../components/layout/admin/DataTable';
import Form from '../../components/ui/Form';
import ProductDetailsCard from '../../components/ui/ProductDetailsCard';

const Products = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Product 1',
      basePrice: 99.99,
      category: 'phone_case',
      isActive: true,
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    basePrice: '',
    productionTime: '3',
    codAvailable: false,
    customizable: false,
    personalizationInstructions: '',
    isActive: true,
    isFeatured: false,
    variants: [],
    media: [],
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState({
    name: '',
    size: '',
    color: '',
    material: '',
    price: '',
    stock: '',
  });

  const columns = [
    {
      id: 'media',
      label: 'Image',
      render: (row) => (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {row.media && row.media.length > 0 ? (
            <img
              src={row.media[0].url}
              alt={row.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.grey[100],
              }}
            >
              <RiImageAddLine size={20} />
            </Box>
          )}
        </Box>
      ),
    },
    { id: 'title', label: 'Product Name' },
    { 
      id: 'basePrice', 
      label: 'Price', 
      align: 'right',
      render: (row) => `₹${row.basePrice}`,
    },
    { id: 'category', label: 'Category' },
    {
      id: 'stock',
      label: 'Stock',
      align: 'right',
      render: (row) => {
        const totalStock = row.variants?.reduce((sum, variant) => sum + variant.stock, 0) || 0;
        return (
          <Typography
            sx={{
              color: totalStock > 10 ? 'success.main' : totalStock > 0 ? 'warning.main' : 'error.main',
              fontWeight: 500,
            }}
          >
            {totalStock}
          </Typography>
        );
      },
    },
    {
      id: 'isActive',
      label: 'Status',
      render: (row) => (
        <Typography
          sx={{
            color: row.isActive ? 'success.main' : 'error.main',
            fontWeight: 500,
          }}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </Typography>
      ),
    },
    {
      id: 'isFeatured',
      label: 'Featured',
      render: (row) => (
        <Typography
          sx={{
            color: row.isFeatured ? 'primary.main' : 'text.secondary',
            fontWeight: 500,
          }}
        >
          {row.isFeatured ? 'Yes' : 'No'}
        </Typography>
      ),
    },
    {
      id: 'codAvailable',
      label: 'COD',
      render: (row) => (
        <Typography
          sx={{
            color: row.codAvailable ? 'success.main' : 'text.secondary',
            fontWeight: 500,
          }}
        >
          {row.codAvailable ? 'Available' : 'Not Available'}
        </Typography>
      ),
    },
  ];

  const handleOpen = (product = null) => {
    setSelectedProduct(product);
    if (product) {
      setFormData(product);
      setVariants(product.variants || []);
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        category: '',
        basePrice: '',
        productionTime: '3',
        codAvailable: false,
        customizable: false,
        personalizationInstructions: '',
        isActive: true,
        isFeatured: false,
        variants: [],
        media: [],
      });
      setVariants([]);
    }
    setMediaFiles([]);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setFormData({});
    setMediaFiles([]);
    setVariants([]);
    setOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Create FormData to send both product data and media files
      const formData = new FormData();

      // Append all product data
      formData.append('title', formData.title);
      formData.append('slug', formData.slug);
      formData.append('description', formData.description);
      formData.append('category', formData.category);
      formData.append('basePrice', Number(formData.basePrice));
      formData.append('productionTime', Number(formData.productionTime));
      formData.append('codAvailable', formData.codAvailable);
      formData.append('customizable', formData.customizable);
      formData.append('isActive', formData.isActive);
      formData.append('isFeatured', formData.isFeatured);

      // Append variants as JSON string
      formData.append('variants', JSON.stringify(variants.map(variant => ({
        name: variant.name,
        size: variant.size,
        color: variant.color,
        material: variant.material,
        price: Number(variant.price),
        stock: Number(variant.stock),
      }))));

      // Append personalization instructions if customizable
      if (formData.customizable) {
        formData.append('personalizationInstructions', formData.personalizationInstructions);
      }

      // Append media files
      mediaFiles.forEach((file, index) => {
        formData.append('media', file);
      });

      // Make API call to save the product with media
      const response = await fetch('/api/products', {
        method: selectedProduct ? 'PUT' : 'POST',
        body: formData, // Send FormData directly
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      const savedProduct = await response.json();

      // Update local state
      if (selectedProduct) {
        setProducts(products.map(p => 
          p.id === selectedProduct.id ? { ...p, ...savedProduct } : p
        ));
      } else {
        setProducts([...products, savedProduct]);
      }

      handleClose();
    } catch (error) {
      console.error('Error saving product:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleDelete = (product) => {
    setProducts(products.filter(p => p.id !== product.id));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      // You might want to show a warning message here
      console.warn('Some files were rejected due to invalid type or size');
    }

    setMediaFiles(prev => [...prev, ...validFiles]);
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    if (currentVariant.name && currentVariant.price) {
      const newVariant = {
        ...currentVariant,
        id: Date.now(),
        price: Number(currentVariant.price),
        stock: Number(currentVariant.stock),
      };
      setVariants([...variants, newVariant]);
      setCurrentVariant({
        name: '',
        size: '',
        color: '',
        material: '',
        price: '',
        stock: '',
      });
    }
  };

  const removeVariant = (id) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const formFields = [
    {
      name: 'title',
      label: 'Product Title',
      type: 'text',
      value: formData.title,
      onChange: (e) => setFormData({ ...formData, title: e.target.value }),
      placeholder: 'Enter product title',
    },
    {
      name: 'slug',
      label: 'Product Slug',
      type: 'text',
      value: formData.slug,
      onChange: (e) => setFormData({ ...formData, slug: e.target.value }),
      placeholder: 'Enter product slug',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      value: formData.description,
      onChange: (e) => setFormData({ ...formData, description: e.target.value }),
      placeholder: 'Enter product description',
    },
    {
      name: 'category',
      label: 'Category',
      type: 'text',
      value: formData.category,
      onChange: (e) => setFormData({ ...formData, category: e.target.value }),
      placeholder: 'Enter product category',
    },
    {
      name: 'basePrice',
      label: 'Base Price',
      type: 'number',
      value: formData.basePrice,
      onChange: (e) => setFormData({ ...formData, basePrice: e.target.value }),
      placeholder: 'Enter base price',
    },
    {
      name: 'productionTime',
      label: 'Production Time (days)',
      type: 'number',
      value: formData.productionTime,
      onChange: (e) => setFormData({ ...formData, productionTime: e.target.value }),
      placeholder: 'Enter production time in days',
    },
    {
      name: 'codAvailable',
      label: 'COD Available',
      type: 'checkbox',
      value: formData.codAvailable,
      onChange: (e) => setFormData({ ...formData, codAvailable: e.target.checked }),
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      value: formData.isActive,
      onChange: (e) => setFormData({ ...formData, isActive: e.target.checked }),
    },
    {
      name: 'customizable',
      label: 'Customizable',
      type: 'checkbox',
      value: formData.customizable,
      onChange: (e) => setFormData({ ...formData, customizable: e.target.checked }),
    },
    {
      name: 'isFeatured',
      label: 'Featured',
      type: 'checkbox',
      value: formData.isFeatured,
      onChange: (e) => setFormData({ ...formData, isFeatured: e.target.checked }),
    },
    {
      name: 'media',
      label: 'Upload Media',
      type: 'file',
      accept: 'image/*,video/*',
      multiple: true,
      onChange: handleMediaChange,
      preview: mediaFiles,
      onRemove: removeMedia,
    },
  ];

  if (formData.customizable) {
    formFields.push({
      name: 'personalizationInstructions',
      label: 'Personalization Instructions',
      type: 'textarea',
      value: formData.personalizationInstructions,
      onChange: (e) => setFormData({ ...formData, personalizationInstructions: e.target.value }),
      placeholder: 'Enter personalization instructions',
    });
  }

  const variantFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      value: currentVariant.name,
      onChange: (e) => setCurrentVariant({ ...currentVariant, name: e.target.value }),
      placeholder: 'Enter variant name',
    },
    {
      name: 'size',
      label: 'Size',
      type: 'text',
      value: currentVariant.size,
      onChange: (e) => setCurrentVariant({ ...currentVariant, size: e.target.value }),
      placeholder: 'Enter size',
    },
    {
      name: 'color',
      label: 'Color',
      type: 'text',
      value: currentVariant.color,
      onChange: (e) => setCurrentVariant({ ...currentVariant, color: e.target.value }),
      placeholder: 'Enter color',
    },
    {
      name: 'material',
      label: 'Material',
      type: 'text',
      value: currentVariant.material,
      onChange: (e) => setCurrentVariant({ ...currentVariant, material: e.target.value }),
      placeholder: 'Enter material',
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      value: currentVariant.price,
      onChange: (e) => setCurrentVariant({ ...currentVariant, price: e.target.value }),
      placeholder: 'Enter price',
    },
    {
      name: 'stock',
      label: 'Stock',
      type: 'number',
      value: currentVariant.stock,
      onChange: (e) => setCurrentVariant({ ...currentVariant, stock: e.target.value }),
      placeholder: 'Enter stock',
    },
  ];

  const handleView = (product) => {
    setViewProduct(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<RiAddLine />}
            onClick={() => handleOpen()}
            sx={{
              backgroundColor: theme.palette.primary.main,
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Add Product
          </Button>
        </Box>

        <DataTable
          columns={columns}
          data={products}
          onEdit={handleOpen}
          onDelete={handleDelete}
          onView={handleView}
          searchPlaceholder="Search products..."
        />

        <Dialog
          open={!!viewProduct}
          onClose={() => setViewProduct(null)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}
        >
          {viewProduct && (
            <ProductDetailsCard
              product={viewProduct}
              onClose={() => setViewProduct(null)}
            />
          )}
        </Dialog>

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.background.paper,
              borderRadius: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            },
          }}
        >
          <DialogTitle sx={{ 
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2,
          }}>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent>
            <Form
              title=""
              fields={formFields}
              onSubmit={handleSave}
              buttonText={selectedProduct ? 'Update Product' : 'Add Product'}
            >
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Product Variants
                </Typography>
                <Form
                  title=""
                  fields={variantFields}
                  onSubmit={(e) => {
                    e.preventDefault();
                    addVariant();
                  }}
                  buttonText="Add Variant"
                />

                {variants.length > 0 && (
                  <Box sx={{ mb: 3, mt: 2 }}>
                    {variants.map((variant, index) => (
                      <Box
                        key={variant.id}
                        sx={{
                          p: 2,
                          mb: 1,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography>
                          {variant.name} - {variant.size} - {variant.color} - {variant.material} - ${variant.price} - Stock: {variant.stock}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeVariant(variant.id)}
                          sx={{ 
                            color: theme.palette.error.main,
                            '&:hover': {
                              backgroundColor: theme.palette.error.light,
                              color: theme.palette.error.contrastText,
                            },
                          }}
                        >
                          <RiCloseLine />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Form>
          </DialogContent>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default Products; 