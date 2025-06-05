import { useState, useEffect } from 'react';
import { RiImageAddLine, RiDeleteBinLine } from 'react-icons/ri';
import useProductStore from '../../store/productStore';

const ProductForm = ({ product, onCancel }) => {
  const { createProduct, updateProduct } = useProductStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: '',
    category: '',
    slug: '',
    codAvailable: false,
    customizable: false,
    personalizationInstructions: '',
    isFeatured: false,
    isActive: true,
    variants: [],
    media: [],
  });

  const [newVariant, setNewVariant] = useState({
    name: '',
    size: '',
    color: '',
    material: '',
    price: '',
    stock: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        basePrice: product.basePrice?.toString() || '',
        variants: product.variants || [],
        media: product.media || [],
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addVariant = () => {
    if (!newVariant.name || !newVariant.price || !newVariant.stock) {
      setErrors(prev => ({
        ...prev,
        variant: 'Please fill in all required variant fields'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { ...newVariant }]
    }));

    setNewVariant({
      name: '',
      size: '',
      color: '',
      material: '',
      price: '',
      stock: '',
    });

    setErrors(prev => ({ ...prev, variant: null }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...files]
    }));
  };

  const removeMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate required fields
    const requiredFields = ['title', 'description', 'basePrice'];
    const newErrors = {};

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.variants.length === 0) {
      newErrors.variants = 'At least one variant is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (product) {
        await updateProduct(product._id, formData);
      } else {
        await createProduct(formData);
      }
      onCancel();
    } catch (error) {
      console.error('Failed to save product:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Failed to save product'
      }));
    }
  };

  // Helper function to get media preview URL
  const getMediaPreview = (media) => {
    if (media instanceof File) {
      return URL.createObjectURL(media);
    }
    return media.url || media; // Handle both URL strings and objects with url property
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.title ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.description ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price *
            </label>
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.basePrice ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.basePrice && (
              <p className="mt-1 text-sm text-red-500">{errors.basePrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Additional Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="codAvailable"
                checked={formData.codAvailable}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">COD Available</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="customizable"
                checked={formData.customizable}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Customizable</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          {formData.customizable && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personalization Instructions
              </label>
              <textarea
                name="personalizationInstructions"
                value={formData.personalizationInstructions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <RiImageAddLine className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark">
                    <span>Upload files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMediaChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {formData.media.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.media.map((media, index) => (
                  <div key={index} className="relative">
                    <img
                      src={getMediaPreview(media)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <RiDeleteBinLine className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Variants</h3>
        {errors.variants && (
          <p className="text-sm text-red-500 mb-4">{errors.variants}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="name"
            value={newVariant.name}
            onChange={handleVariantChange}
            placeholder="Variant Name *"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="size"
            value={newVariant.size}
            onChange={handleVariantChange}
            placeholder="Size"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="color"
            value={newVariant.color}
            onChange={handleVariantChange}
            placeholder="Color"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="material"
            value={newVariant.material}
            onChange={handleVariantChange}
            placeholder="Material"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            name="price"
            value={newVariant.price}
            onChange={handleVariantChange}
            placeholder="Additional Price *"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            name="stock"
            value={newVariant.stock}
            onChange={handleVariantChange}
            placeholder="Stock *"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="button"
          onClick={addVariant}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Add Variant
        </button>

        {formData.variants.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.variants.map((variant, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{variant.name}</p>
                  <p className="text-sm text-gray-500">
                    {[
                      variant.size,
                      variant.color,
                      variant.material,
                    ]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                  <p className="text-sm">
                    Price: ₹{variant.price} • Stock: {variant.stock}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <RiDeleteBinLine className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          {product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 