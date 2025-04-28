import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiServer, FiBook, FiFileText, FiBriefcase, FiActivity, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { fetchServices, fetchCourses, fetchBlogPosts, fetchJobListings } from '../../lib/supabase';

const Dashboard = () => {
  const [stats, setStats] = useState({
    services: 0,
    courses: 0,
    blogs: 0,
    jobs: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch counts from all services
        const [servicesData, coursesData, blogData, jobsData] = await Promise.all([
          fetchServices(),
          fetchCourses(),
          fetchBlogPosts(),
          fetchJobListings()
        ]);
        
        // Set stats
        setStats({
          services: servicesData.data?.length || 0,
          courses: coursesData.data?.length || 0,
          blogs: blogData.data?.length || 0,
          jobs: jobsData.data?.length || 0
        });
        
        // Generate mock activity log
        const daysAgo = (days) => {
          const date = new Date();
          date.setDate(date.getDate() - days);
          return date.toISOString();
        };
        
        setActivity([
          { id: 1, type: 'service', action: 'created', name: 'Network Security Assessment', date: daysAgo(1), user: 'admin@shruutech.com' },
          { id: 2, type: 'blog', action: 'updated', name: 'The Future of Cybersecurity', date: daysAgo(2), user: 'admin@shruutech.com' },
          { id: 3, type: 'course', action: 'created', name: 'Advanced Penetration Testing', date: daysAgo(3), user: 'admin@shruutech.com' },
          { id: 4, type: 'job', action: 'updated', name: 'Security Engineer Position', date: daysAgo(4), user: 'admin@shruutech.com' },
          { id: 5, type: 'blog', action: 'created', name: 'Zero Trust Architecture', date: daysAgo(5), user: 'admin@shruutech.com' }
        ]);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Icons for activity log
  const getActivityIcon = (type) => {
    switch (type) {
      case 'service':
        return <FiServer className="h-5 w-5 text-indigo-500" />;
      case 'course':
        return <FiBook className="h-5 w-5 text-green-500" />;
      case 'blog':
        return <FiFileText className="h-5 w-5 text-blue-500" />;
      case 'job':
        return <FiBriefcase className="h-5 w-5 text-purple-500" />;
      default:
        return <FiActivity className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-600 dark:text-secondary-400" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400 flex items-start">
        <FiAlertTriangle className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-light">Dashboard</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleString()}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Services', value: stats.services, icon: <FiServer size={24} />, color: 'bg-indigo-500', href: '/admin/services' },
          { title: 'Total Courses', value: stats.courses, icon: <FiBook size={24} />, color: 'bg-green-500', href: '/admin/courses' },
          { title: 'Blog Posts', value: stats.blogs, icon: <FiFileText size={24} />, color: 'bg-blue-500', href: '/admin/blog' },
          { title: 'Job Listings', value: stats.jobs, icon: <FiBriefcase size={24} />, color: 'bg-purple-500', href: '/admin/careers' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-dark-lighter rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.title}</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900 dark:text-light">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-light px-6 py-3">
              <Link 
                to={stat.href} 
                className="text-sm font-medium text-primary-600 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-secondary-500"
              >
                View all
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Log */}
        <motion.div 
          className="lg:col-span-2 bg-white dark:bg-dark-lighter rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-light">Recent Activity</h3>
          </div>
          <div className="px-6 py-4">
            <ul className="space-y-4">
              {activity.map((item) => (
                <li key={item.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-light font-medium">
                      {item.action === 'created' ? 'Created new' : 'Updated'} {item.type}: <span className="font-semibold">{item.name}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      By {item.user} • {new Date(item.date).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-dark-light px-6 py-3">
            <button className="text-sm font-medium text-primary-600 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-secondary-500">
              View all activity
            </button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-white dark:bg-dark-lighter rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-light">Quick Actions</h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            <Link 
              to="/admin/services"
              className="flex items-center p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
            >
              <FiServer className="mr-3 h-5 w-5" />
              <span>Add New Service</span>
            </Link>
            
            <Link 
              to="/admin/courses"
              className="flex items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <FiBook className="mr-3 h-5 w-5" />
              <span>Create New Course</span>
            </Link>
            
            <Link 
              to="/admin/blog"
              className="flex items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <FiFileText className="mr-3 h-5 w-5" />
              <span>Write Blog Post</span>
            </Link>
            
            <Link 
              to="/admin/careers"
              className="flex items-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <FiBriefcase className="mr-3 h-5 w-5" />
              <span>Post Job Opening</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div 
        className="bg-white dark:bg-dark-lighter rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-light">System Status</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
              <FiCheckCircle className="h-6 w-6 text-green-500" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-light">Database</h4>
                <p className="text-sm text-green-700 dark:text-green-300">Operational</p>
              </div>
            </div>
            
            <div className="flex items-center rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
              <FiCheckCircle className="h-6 w-6 text-green-500" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-light">API Services</h4>
                <p className="text-sm text-green-700 dark:text-green-300">Operational</p>
              </div>
            </div>
            
            <div className="flex items-center rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
              <FiCheckCircle className="h-6 w-6 text-green-500" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-light">Storage</h4>
                <p className="text-sm text-green-700 dark:text-green-300">Operational</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;