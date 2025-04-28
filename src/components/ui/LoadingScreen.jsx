import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px]">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-gray-300 border-t-primary-600 dark:border-dark-lighter dark:border-t-secondary-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <p className="mt-4 text-gray-700 dark:text-light-dark">Loading...</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;