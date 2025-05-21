import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="bg-bg-main min-h-screen flex flex-col items-center justify-center text-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="text-8xl mb-6">🌸</div>
        <h1 className="text-4xl font-bold text-dark-purple mb-4">404 - Page Not Found</h1>
        <p className="text-medium-purple mb-8">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Button to="/" variant="primary" icon="ri-arrow-left-line" iconPosition="left">
          Go Home
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound; 