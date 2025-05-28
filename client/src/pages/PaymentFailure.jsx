import React from 'react';
import { Link } from 'react-router-dom';
import cancel from '../assets/cancel.png';

const PaymentFailure = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <img src={cancel} alt="Payment Failed" className="w-24 h-24 mb-4" />
          <h2 className="mt-6 text-3xl font-extrabold text-text-primary">
            Payment Failed
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            We couldn't process your payment. This could be due to:
          </p>
          <ul className="mt-2 text-sm text-text-secondary list-disc list-inside">
            <li>Insufficient funds</li>
            <li>Card declined</li>
            <li>Payment cancelled</li>
            <li>Technical issues</li>
          </ul>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            to="/cart"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
          >
            Return to Cart
          </Link>
          <Link
            to="/shop"
            className="w-full flex justify-center py-3 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-transparent hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure; 