import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import success from '../assets/success.png';
import ReactConfetti from 'react-confetti';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [receiptPDF, setReceiptPDF] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    // Check if state data exists, otherwise redirect to home or shop
    if (location.state && location.state.order && location.state.receiptPDF) {
      setOrder(location.state.order);
      setReceiptPDF(location.state.receiptPDF);
    } else {
      // Redirect if no order data is available (e.g., page was accessed directly)
      navigate('/shop'); // Or wherever makes sense
    }
  }, [location.state, navigate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!order) {
    // Optionally show a loading state or a message while redirecting
    return null; 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
      <ReactConfetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
        initialVelocityY={10}
        colors={['#FF69B4', '#9370DB', '#FFB6C1', '#DDA0DD', '#EE82EE']}
      />
      <div className="max-w-2xl w-full space-y-8 text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img src={success} alt="Payment Successful" className="w-24 h-24 mb-4" />
          <h2 className="mt-6 text-3xl font-extrabold text-text-primary">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            A confirmation email with your receipt has been sent to your registered email address.
          </p>
        </div>

        {/* Order Details Section */}
        <div className="text-left mt-8 border-t border-b border-gray-200 dark:border-gray-700 py-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Order Summary</h3>
          <p className="text-sm text-text-secondary"><strong>Order ID:</strong> {order._id}</p>
          <p className="text-sm text-text-secondary"><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p className="text-sm text-text-secondary mb-4"><strong>Payment Method:</strong> {order.paymentMethod}</p>

          <h4 className="text-lg font-semibold text-text-primary mb-3">Items:</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Variant</th>
                  <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.map((item) => (
                  <tr key={item._id || item.productId + JSON.stringify(item.variant)}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text-primary">{item.productSnapshot?.title || 'N/A'}</td>
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">{`${item.variant.size || ''} ${item.variant.color || ''} ${item.variant.material || ''}`.trim()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary text-center">{item.quantity}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary text-right">₹{item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary font-semibold text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
                 <tr>
                  <td colSpan="4" className="px-4 py-3 text-right text-sm font-medium text-text-primary">Total Amount:</td>
                  <td className="px-4 py-3 whitespace-nowrap text-lg font-semibold text-text-primary text-right">₹{order.totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Download PDF Button */}
        {receiptPDF && (
          <div className="mt-4 text-center">
            <a
              href={receiptPDF}
              download={`order_receipt_${order._id}.pdf`}
              className="inline-flex items-center px-4 py-2 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-transparent hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
            >
              Download Receipt PDF
            </a>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 space-y-4">
          <Link
            to="/shop"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 