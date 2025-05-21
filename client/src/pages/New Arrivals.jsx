import { motion } from 'framer-motion';

const NewArrivals = () => {
  return (
    <div className="bg-bg-main min-h-screen flex flex-col items-center justify-center text-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="text-6xl mb-6">🆕</div>
        <h1 className="text-3xl font-bold text-dark-purple mb-4">New Arrivals</h1>
        <p className="text-medium-purple mb-8">
          Check back soon for our latest cute products!
        </p>
      </motion.div>
    </div>
  );
};

export default NewArrivals; 