import BaseForm from './BaseForm';
import FormField from './FormField';

const OrderForm = ({
  order,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Details */}
      <div>
        <BaseForm
          title="Order Details"
          isEditing={isEditing}
          onSubmit={onSubmit}
          onCancel={onCancel}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Order ID</h4>
                <p className="text-gray-800">{order.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Date</h4>
                <p className="text-gray-800">{new Date(order.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Customer</h4>
              <p className="text-gray-800">{order.customer}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Amount</h4>
              <p className="text-gray-800">{order.amount}</p>
            </div>

            <FormField
              label="Status"
              name="status"
              type="select"
              value={order.status}
              onChange={onChange}
              disabled={!isEditing}
              options={statusOptions}
              required
            />

            <FormField
              label="Tracking Number"
              name="trackingNumber"
              value={order.trackingNumber || ''}
              onChange={onChange}
              disabled={!isEditing}
              placeholder="Enter tracking number"
            />

            <FormField
              label="Notes"
              name="notes"
              type="textarea"
              value={order.notes || ''}
              onChange={onChange}
              disabled={!isEditing}
              placeholder="Add any order notes here"
            />
          </div>
        </BaseForm>
      </div>

      {/* Order Items */}
      <div>
        <BaseForm
          title="Order Items"
          isEditing={false}
        >
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </BaseForm>
      </div>
    </div>
  );
};

export default OrderForm; 