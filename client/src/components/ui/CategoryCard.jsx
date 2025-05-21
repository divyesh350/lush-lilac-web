import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryCard = ({ category, icon, bgColor = '#FFB5D8' }) => {
  return (
    <motion.div 
      className="category-card bg-white rounded-lg p-6 text-center"
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(232, 213, 228, 0.5)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/shop?category=${category.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center`} style={{ backgroundColor: bgColor }}>
          <i className={`${icon} ri-xl text-dark-purple`}></i>
        </div>
        <h3 className="text-dark-purple font-medium">{category}</h3>
      </Link>
    </motion.div>
  );
};

export default CategoryCard; 