import { RiImageAddLine, RiDeleteBinLine } from 'react-icons/ri';
import BaseForm from './BaseForm';
import FormField from './FormField';

const ProductForm = ({
  product,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
  onImageDelete,
}) => {
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Images */}
      <div className="lg:col-span-1">
        <BaseForm
          title="Product Images"
          isEditing={isEditing}
          onSubmit={onSubmit}
          onCancel={onCancel}
        >
          <div className="grid grid-cols-2 gap-4">
            {product.images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {isEditing && (
                  <button
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
                    onClick={() => onImageDelete(index)}
                  >
                    <RiDeleteBinLine />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <button className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary hover:text-primary">
                <RiImageAddLine size={24} />
              </button>
            )}
          </div>
        </BaseForm>
      </div>

      {/* Right Column - Details */}
      <div className="lg:col-span-2">
        <BaseForm
          title="Product Details"
          isEditing={isEditing}
          onSubmit={onSubmit}
          onCancel={onCancel}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Product Name"
              name="name"
              value={product.name}
              onChange={onChange}
              disabled={!isEditing}
              required
            />
            <FormField
              label="SKU"
              name="sku"
              value={product.sku}
              onChange={onChange}
              disabled={!isEditing}
              required
            />
            <FormField
              label="Price (₹)"
              name="price"
              type="number"
              value={product.price}
              onChange={onChange}
              disabled={!isEditing}
              required
            />
            <FormField
              label="Stock"
              name="stock"
              type="number"
              value={product.stock}
              onChange={onChange}
              disabled={!isEditing}
              required
            />
            <FormField
              label="Category"
              name="category"
              value={product.category}
              onChange={onChange}
              disabled={!isEditing}
              required
            />
            <FormField
              label="Status"
              name="status"
              type="select"
              value={product.status}
              onChange={onChange}
              disabled={!isEditing}
              options={statusOptions}
              required
            />
          </div>

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={product.description}
            onChange={onChange}
            disabled={!isEditing}
            required
          />

          <FormField
            label="Featured Product"
            name="featured"
            type="checkbox"
            value={product.featured}
            onChange={onChange}
            disabled={!isEditing}
          />
        </BaseForm>
      </div>
    </div>
  );
};

export default ProductForm; 