import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiTag } from 'react-icons/fi';
import { fetchBlogPosts } from '../lib/supabase';

// Initial blog posts data
const initialPosts = [
  {
    id: 1,
    title: 'The Future of Cybersecurity: AI and Machine Learning',
    excerpt: 'Explore how artificial intelligence and machine learning are revolutionizing cybersecurity defenses and threat detection.',
    content: 'Long content here...',
    category: 'Emerging Technologies',
    author: 'John Smith',
    date: '2025-04-05',
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    readTime: '6 min read'
  },
  {
    id: 2,
    title: 'Zero Trust Architecture: Implementation Best Practices',
    excerpt: 'A comprehensive guide to implementing Zero Trust security architecture in your organization.',
    content: 'Long content here...',
    category: 'Security Architecture',
    author: 'Emily Chen',
    date: '2025-03-22',
    image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    readTime: '8 min read'
  },
  {
    id: 3,
    title: 'Ransomware Attacks: Prevention and Recovery Strategies',
    excerpt: 'Learn how to protect your organization from ransomware and develop effective recovery plans.',
    content: 'Long content here...',
    category: 'Threat Protection',
    author: 'Michael Johnson',
    date: '2025-03-15',
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    readTime: '5 min read'
  },
  {
    id: 4,
    title: 'Cloud Security Challenges and Solutions',
    excerpt: 'Addressing the unique security challenges of cloud environments and strategies for mitigating risks.',
    content: 'Long content here...',
    category: 'Cloud Security',
    author: 'Sarah Williams',
    date: '2025-03-08',
    image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    readTime: '7 min read'
  },
  {
    id: 5,
    title: 'The Human Element: Social Engineering Attacks',
    excerpt: 'Understanding how cybercriminals exploit human psychology and how to build a security-aware culture.',
    content: 'Long content here...',
    category: 'Security Awareness',
    author: 'Robert Davis',
    date: '2025-02-28',
    image: 'https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    readTime: '4 min read'
  },
  {
    id: 6,
    title: 'IoT Security: Protecting the Connected Ecosystem',
    excerpt: 'Strategies for securing the rapidly expanding ecosystem of Internet of Things devices.',
    content: 'Long content here...',
    category: 'IoT Security',
    author: 'Jennifer Lee',
    date: '2025-02-15',
    image: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    readTime: '6 min read'
  }
];

const Blog = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        const { data, error } = await fetchBlogPosts();
        if (error) throw error;
        if (data && data.length > 0) {
          // Use database posts if available
          setPosts(data.map(post => ({
            ...post,
            image: post.image || initialPosts.find(p => p.id === post.id)?.image || initialPosts[0].image
          })));
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    getBlogPosts();
  }, []);

  useEffect(() => {
    // Extract unique categories
    const allCategories = ['All', ...new Set(posts.map(post => post.category))];
    setCategories(allCategories);
    
    // Apply filters
    filterPosts(searchTerm, selectedCategory);
  }, [posts]);

  const filterPosts = (search, category) => {
    let filtered = [...posts];
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply category filter
    if (category && category !== 'All') {
      filtered = filtered.filter(post => post.category === category);
    }
    
    setFilteredPosts(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterPosts(value, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterPosts(searchTerm, category);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-dark-light to-dark dark:from-dark dark:to-dark-lighter text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4974920/pexels-photo-4974920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Security Blog
            </motion.h1>
            <motion.p 
              className="text-xl text-light-dark mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Insights, analysis, and news from the frontlines of cybersecurity
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white dark:bg-dark-light border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="w-full md:w-auto relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-dark-lighter dark:text-light rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 dark:bg-secondary-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-lighter text-gray-700 dark:text-light-dark hover:bg-gray-200 dark:hover:bg-dark'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-gray-50 dark:bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  className="bg-white dark:bg-dark-lighter rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-dark text-primary-800 dark:text-secondary-400">
                          <FiTag className="mr-1" /> {post.category}
                        </span>
                        <span className="ml-auto inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <FiClock className="mr-1" /> {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold leading-tight mb-2 text-gray-900 dark:text-light hover:text-primary-600 dark:hover:text-secondary-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-light-darker mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          By {post.author}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-light mb-2">No articles found</h3>
              <p className="text-gray-600 dark:text-light-darker">
                We couldn't find any articles matching your search criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white dark:bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 dark:text-light mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Stay Updated on Security Trends
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 dark:text-light-darker mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Subscribe to our newsletter for the latest cybersecurity insights and updates.
            </motion.p>
            <motion.form 
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 flex-grow sm:max-w-xs rounded-md border border-gray-300 dark:border-gray-700 dark:bg-dark-lighter dark:text-light focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-secondary-400"
                required
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;