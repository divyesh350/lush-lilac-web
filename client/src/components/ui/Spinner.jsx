import { motion } from 'framer-motion';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-bg-main">
      <div className="relative">
        {/* Outer circle */}
        <motion.div
          className="w-16 h-16 border-4 border-light-pink rounded-full"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity
          }}
        />
        
        {/* Middle circle */}
        <motion.div
          className="absolute top-1 left-1 w-14 h-14 border-4 border-lilac-purple rounded-full"
          animate={{
            rotate: -360
          }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Infinity
          }}
        />
        
        {/* Inner circle */}
        <motion.div
          className="absolute top-2 left-2 w-12 h-12 border-4 border-primary rounded-full"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity
          }}
        />
        
        {/* Center flower */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity
          }}
        >
          <span className="text-white text-sm">🌸</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Spinner; 