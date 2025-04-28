import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiServer, FiBook, FiFileText, FiBriefcase, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../ui/Logo';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', icon: FiHome, href: '/admin' },
    { name: 'Services', icon: FiServer, href: '/admin/services' },
    { name: 'Courses', icon: FiBook, href: '/admin/courses' },
    { name: 'Blog', icon: FiFileText, href: '/admin/blog' },
    { name: 'Careers', icon: FiBriefcase, href: '/admin/careers' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dark-light">
      {/* Sidebar */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-lighter shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Logo className="h-8 w-auto" />
            <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-light">Admin</span>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary-50 text-primary-600 dark:bg-dark-light dark:text-secondary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-light-dark dark:hover:bg-dark-light'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Logout button */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-light-dark dark:hover:bg-dark-light rounded-md transition-colors"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'md:ml-64' : ''} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white dark:bg-dark-lighter shadow-sm h-16 flex items-center px-4 md:px-6">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 dark:text-light-dark hover:text-gray-900 dark:hover:text-light md:hidden"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <h1 className="ml-4 text-xl font-semibold text-gray-800 dark:text-light">
            {navigation.find(item => item.href === location.pathname)?.name || 'Admin Panel'}
          </h1>
          
          <div className="ml-auto">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-light-dark hover:bg-gray-100 dark:hover:bg-dark-light transition-colors"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </header>

        {/* Page content */}
        <motion.main 
          className="flex-1 overflow-y-auto p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;