import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatBot from '../ui/ChatBot';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <motion.main 
        className="flex-grow pt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      
      <Footer />
      
      {/* Chatbot fixed at bottom right */}
      <ChatBot />
    </div>
  );
};

export default Layout;