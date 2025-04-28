import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle, FiCheck, FiCalendar, FiClock, FiMonitor, FiDollarSign, FiUsers, FiUser } from 'react-icons/fi';
import { fetchCourses, createCourse, updateCourse, deleteCourse, uploadImage } from '../../lib/supabase';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    duration: '',
    schedule: '',
    timing: '',
    mode: 'Online',
    fees: '',
    batch: '',
    trainer: '',
    image: ''
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await fetchCourses();
      
      if (error) throw error;
      
      // Sort courses by creation date (newest first)
      const sortedCourses = data ? [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
      setCourses(sortedCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type, course = null) => {
    setModalType(type);
    
    if (type === 'create') {
      setCourseForm({
        title: '',
        description: '',
        duration: '',
        schedule: '',
        timing: '',
        mode: 'Online',
        fees: '',
        batch: '',
        trainer: '',
        image: ''
      });
      setImagePreview(null);
    } else if (type === 'edit' && course) {
      setCourseForm({
        title: course.title || '',
        description: course.description || '',
        duration: course.duration || '',
        schedule: course.schedule || '',
        timing: course.timing || '',
        mode: course.mode || 'Online',
        fees: course.fees || '',
        batch: course.batch || '',
        trainer: course.trainer || '',
        image: course.image || ''
      });
      setImagePreview(course.image || null);
      setCurrentCourse(course);
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
    setCourseForm({ ...courseForm, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      let imageUrl = courseForm.image;
      
      // Upload image if new file is selected
      if (imageFile) {
        setIsUploading(true);
        const { data, error } = await uploadImage(imageFile, 'courses', 'images');
        
        if (error) throw error;
        
        if (data && data.publicUrl) {
          imageUrl = data.publicUrl;
        }
        setIsUploading(false);
      }
      
      const courseData = {
        ...courseForm,
        image: imageUrl
      };
      
      if (modalType === 'create') {
        const { error } = await createCourse(courseData);
        if (error) throw error;
        setSuccessMessage('Course created successfully!');
      } else if (modalType === 'edit' && currentCourse) {
        const { error } = await updateCourse(currentCourse.id, courseData);
        if (error) throw error;
        setSuccessMessage('Course updated successfully!');
      }
      
      // Refresh the courses list
      await fetchAllCourses();
      
      // Close the modal after a delay to show success message
      setTimeout(() => {
        handleCloseModal();
        setSuccessMessage(null);
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting course:', err);
      setError('Failed to save course. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await deleteCourse(course.id);
      if (error) throw error;
      
      // Refresh the courses list
      await fetchAllCourses();
      setSuccessMessage('Course deleted successfully!');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Use a fallback image if no image is available
  const getFallbackImage = (index) => {
    const fallbackImages = [
      'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5380659/pexels-photo-5380659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ];
    
    return fallbackImages[index % fallbackImages.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-light">Courses Management</h1>
        <button
          onClick={() => handleOpenModal('create')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-secondary-600 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-secondary-500"
        >
          <FiPlus className="mr-2 -ml-1 h-5 w-5" />
          Add Course
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

      {/* Courses Grid */}
      {loading ? (
        <div className="p-6 text-center bg-white dark:bg-dark-lighter shadow overflow-hidden rounded-md">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-600 dark:text-secondary-400" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-10 text-center bg-white dark:bg-dark-lighter shadow overflow-hidden rounded-md">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-light">No courses</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new course.</p>
          <div className="mt-6">
            <button
              onClick={() => handleOpenModal('create')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-secondary-600 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-secondary-500"
            >
              <FiPlus className="mr-2 -ml-1 h-5 w-5" />
              Add Course
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div 
              key={course.id}
              className="bg-white dark:bg-dark-lighter shadow-md rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={course.image || getFallbackImage(index)} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleOpenModal('edit', course)}
                    className="p-2 bg-white bg-opacity-80 dark:bg-dark-lighter dark:bg-opacity-80 rounded-full text-gray-700 dark:text-light-dark hover:bg-opacity-100 dark:hover:bg-opacity-100"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course)}
                    className="p-2 bg-white bg-opacity-80 dark:bg-dark-lighter dark:bg-opacity-80 rounded-full text-red-500 hover:bg-opacity-100 dark:hover:bg-opacity-100"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-light mb-2">{course.title}</h3>
                <p className="text-gray-600 dark:text-light-darker line-clamp-2 mb-4">{course.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-light-darker">
                    <FiCalendar className="mr-1.5 text-primary-600 dark:text-secondary-400 flex-shrink-0" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-light-darker">
                    <FiClock className="mr-1.5 text-primary-600 dark:text-secondary-400 flex-shrink-0" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-light-darker">
                    <FiMonitor className="mr-1.5 text-primary-600 dark:text-secondary-400 flex-shrink-0" />
                    <span>{course.mode}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-light-darker">
                    <FiDollarSign className="mr-1.5 text-primary-600 dark:text-secondary-400 flex-shrink-0" />
                    <span>{course.fees}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-light-darker mb-2">
                  <FiUsers className="mr-1.5 text-primary-600 dark:text-secondary-400 flex-shrink-0" />
                  <span>{course.batch}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-light-darker">
                  <FiUser className="mr-1.5 text-primary-600 dark:text-secondary-400 flex-shrink-0" />
                  <span>{course.trainer}</span>
                </div>
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
              className="inline-block align-bottom bg-white dark:bg-dark-lighter rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-light mb-4">
                      {modalType === 'create' ? 'Add New Course' : 'Edit Course'}
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
                            value={courseForm.title}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                          Description*
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows="3"
                            required
                            value={courseForm.description}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          ></textarea>
                        </div>
                      </div>

                      {/* Course Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                          Course Image
                        </label>
                        <div className="mt-1 flex items-center">
                          {imagePreview && (
                            <div className="mr-4 h-16 w-24 rounded overflow-hidden bg-gray-100 dark:bg-dark-light">
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
                          {isUploading ? 'Uploading image...' : 'Upload a course image (optional)'}
                        </p>
                      </div>

                      {/* Course Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Duration*
                          </label>
                          <input
                            type="text"
                            name="duration"
                            id="duration"
                            required
                            placeholder="e.g., 8 weeks"
                            value={courseForm.duration}
                            onChange={handleInputChange}
                            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Schedule*
                          </label>
                          <input
                            type="text"
                            name="schedule"
                            id="schedule"
                            required
                            placeholder="e.g., Mon & Wed"
                            value={courseForm.schedule}
                            onChange={handleInputChange}
                            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="timing" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Timing*
                          </label>
                          <input
                            type="text"
                            name="timing"
                            id="timing"
                            required
                            placeholder="e.g., 6:00 PM - 8:00 PM"
                            value={courseForm.timing}
                            onChange={handleInputChange}
                            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="mode" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Mode*
                          </label>
                          <select
                            name="mode"
                            id="mode"
                            required
                            value={courseForm.mode}
                            onChange={handleInputChange}
                            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          >
                            <option value="Online">Online</option>
                            <option value="In-person">In-person</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="fees" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Fees*
                          </label>
                          <input
                            type="text"
                            name="fees"
                            id="fees"
                            required
                            placeholder="e.g., $599"
                            value={courseForm.fees}
                            onChange={handleInputChange}
                            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="batch" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Batch*
                          </label>
                          <input
                            type="text"
                            name="batch"
                            id="batch"
                            required
                            placeholder="e.g., Starts June 15, 2025"
                            value={courseForm.batch}
                            onChange={handleInputChange}
                            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="trainer" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Trainer*
                          </label>
                          <input
                            type="text"
                            name="trainer"
                            id="trainer"
                            required
                            placeholder="e.g., John Smith, CISSP"
                            value={courseForm.trainer}
                            onChange={handleInputChange}
                            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
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
                    {isSubmitting ? 'Saving...' : (modalType === 'create' ? 'Create' : 'Update')}
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

export default Courses;