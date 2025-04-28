import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle, FiCheck, FiClock, FiTag, FiUser, FiCalendar, FiEye } from 'react-icons/fi';
import { fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, uploadImage } from '../../lib/supabase';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [currentPost, setCurrentPost] = useState(null);
  const [postForm, setPostForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    readTime: '',
    tags: [],
    image: ''
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await fetchBlogPosts();
      
      if (error) throw error;
      
      // Sort posts by creation date (newest first)
      const sortedPosts = data ? [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
      setPosts(sortedPosts);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type, post = null) => {
    setModalType(type);
    
    if (type === 'create') {
      setPostForm({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: '',
        readTime: '',
        tags: [],
        image: ''
      });
      setImagePreview(null);
      setTagInput('');
    } else if (type === 'edit' && post) {
      setPostForm({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        category: post.category || '',
        author: post.author || '',
        readTime: post.readTime || '',
        tags: post.tags || [],
        image: post.image || ''
      });
      setImagePreview(post.image || null);
      setTagInput('');
      setCurrentPost(post);
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsSubmitting(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostForm({ ...postForm, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !postForm.tags.includes(tagInput.trim())) {
      setPostForm({
        ...postForm,
        tags: [...postForm.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setPostForm({
      ...postForm,
      tags: postForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      let imageUrl = postForm.image;
      
      // Upload image if new file is selected
      if (imageFile) {
        setIsUploading(true);
        const { data, error } = await uploadImage(imageFile, 'blog', 'images');
        
        if (error) throw error;
        
        if (data && data.publicUrl) {
          imageUrl = data.publicUrl;
        }
        setIsUploading(false);
      }
      
      // Add current date if creating new post
      const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const postData = {
        ...postForm,
        image: imageUrl,
        date: modalType === 'create' ? now : currentPost?.date || now
      };
      
      if (modalType === 'create') {
        const { error } = await createBlogPost(postData);
        if (error) throw error;
        setSuccessMessage('Blog post created successfully!');
      } else if (modalType === 'edit' && currentPost) {
        const { error } = await updateBlogPost(currentPost.id, postData);
        if (error) throw error;
        setSuccessMessage('Blog post updated successfully!');
      }
      
      // Refresh the posts list
      await fetchAllPosts();
      
      // Close the modal after a delay to show success message
      setTimeout(() => {
        handleCloseModal();
        setSuccessMessage(null);
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting blog post:', err);
      setError('Failed to save blog post. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (post) => {
    if (!window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await deleteBlogPost(post.id);
      if (error) throw error;
      
      // Refresh the posts list
      await fetchAllPosts();
      setSuccessMessage('Blog post deleted successfully!');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error deleting blog post:', err);
      setError('Failed to delete blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Use a fallback image if no image is available
  const getFallbackImage = (index) => {
    const fallbackImages = [
      'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ];
    
    return fallbackImages[index % fallbackImages.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-light">Blog Management</h1>
        <button
          onClick={() => handleOpenModal('create')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-secondary-600 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-secondary-500"
        >
          <FiPlus className="mr-2 -ml-1 h-5 w-5" />
          Add Blog Post
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-md text-green-600 dark:text-green-400 flex items-start">
          <FiCheck className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md text-red-600 dark:text-red-400 flex items-start">
          <FiAlertTriangle className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
          <span>{error}</span>
          <button
            className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Blog Posts Grid */}
      {loading ? (
        <div className="p-6 text-center bg-white dark:bg-dark-lighter shadow overflow-hidden rounded-md">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-600 dark:text-secondary-400" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading blog posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="p-10 text-center bg-white dark:bg-dark-lighter shadow overflow-hidden rounded-md">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-light">No blog posts</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new blog post.</p>
          <div className="mt-6">
            <button
              onClick={() => handleOpenModal('create')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-secondary-600 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-secondary-500"
            >
              <FiPlus className="mr-2 -ml-1 h-5 w-5" />
              Add Blog Post
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div 
              key={post.id}
              className="bg-white dark:bg-dark-lighter shadow-md rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={post.image || getFallbackImage(index)} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleOpenModal('edit', post)}
                    className="p-2 bg-white bg-opacity-80 dark:bg-dark-lighter dark:bg-opacity-80 rounded-full text-gray-700 dark:text-light-dark hover:bg-opacity-100 dark:hover:bg-opacity-100"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post)}
                    className="p-2 bg-white bg-opacity-80 dark:bg-dark-lighter dark:bg-opacity-80 rounded-full text-red-500 hover:bg-opacity-100 dark:hover:bg-opacity-100"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-dark text-primary-800 dark:text-secondary-400">
                    <FiTag className="mr-1" /> {post.category}
                  </span>
                  <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <FiClock className="mr-1" /> {post.readTime || '5 min read'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-light mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 dark:text-light-darker line-clamp-3 mb-4">{post.excerpt}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FiUser className="mr-1" /> {post.author}
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FiCalendar className="mr-1" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-dark text-gray-700 dark:text-light-dark rounded">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-dark text-gray-700 dark:text-light-dark rounded">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={handleCloseModal}>
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

            <motion.div 
              className="inline-block align-bottom bg-white dark:bg-dark-lighter rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-light mb-4">
                      {modalType === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
                    </h3>

                    {/* Success Message */}
                    {successMessage && (
                      <div className="p-3 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-md text-green-600 dark:text-green-400 flex items-start">
                        <FiCheck className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
                        <span>{successMessage}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                          Title*
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={postForm.title}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Category */}
                        <div className="flex-1">
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Category*
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="category"
                              id="category"
                              required
                              placeholder="e.g., Security Architecture"
                              value={postForm.category}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                            />
                          </div>
                        </div>

                        {/* Author */}
                        <div className="flex-1">
                          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Author*
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="author"
                              id="author"
                              required
                              placeholder="e.g., John Smith"
                              value={postForm.author}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                            />
                          </div>
                        </div>

                        {/* Read Time */}
                        <div className="w-32">
                          <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Read Time*
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="readTime"
                              id="readTime"
                              required
                              placeholder="e.g., 5 min read"
                              value={postForm.readTime}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                          Excerpt*
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="excerpt"
                            name="excerpt"
                            rows="2"
                            required
                            placeholder="A brief summary of the blog post (1-2 sentences)"
                            value={postForm.excerpt}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          ></textarea>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                          Content*
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="content"
                            name="content"
                            rows="12"
                            required
                            placeholder="Write your blog post content here. HTML formatting is supported (e.g., <h2>, <p>, <ul>, <li>, etc.)"
                            value={postForm.content}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm font-mono border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          ></textarea>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <FiEye className="inline mr-1" /> HTML formatting is supported
                        </p>
                      </div>

                      {/* Featured Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                          Featured Image
                        </label>
                        <div className="mt-1 flex items-center">
                          {imagePreview && (
                            <div className="mr-4 h-20 w-32 rounded overflow-hidden bg-gray-100 dark:bg-dark-light">
                              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {isUploading ? 'Uploading image...' : 'Recommended size: 1200 x 800 pixels'}
                        </p>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                          Tags
                        </label>
                        <div className="mt-1 flex">
                          <input
                            type="text"
                            placeholder="Add a tag and press Enter"
                            value={tagInput}
                            onChange={handleTagInputChange}
                            onKeyDown={handleTagInputKeyDown}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-l-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-light text-gray-700 dark:text-light-dark rounded-r-md hover:bg-gray-100 dark:hover:bg-dark"
                          >
                            Add
                          </button>
                        </div>
                        {postForm.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {postForm.tags.map((tag, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-dark text-primary-800 dark:text-secondary-400"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-primary-400 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-secondary-100"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-dark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 dark:bg-secondary-600 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-secondary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : (modalType === 'create' ? 'Publish' : 'Update')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-dark-light text-base font-medium text-gray-700 dark:text-light-dark hover:bg-gray-50 dark:hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-secondary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;