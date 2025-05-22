import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { RiSunLine, RiMoonLine } from '@remixicon/react';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isDarkMode ? (
        <RiSunLine className="w-6 h-6 text-yellow-400" />
      ) : (
        <RiMoonLine className="w-6 h-6 text-primary" />
      )}
    </motion.button>
  );
};

export default ThemeToggle; 