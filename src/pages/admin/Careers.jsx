import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle, FiCheck, FiMapPin, FiClock, FiBriefcase, FiDollarSign } from 'react-icons/fi';
import { fetchJobListings, createJobListing, updateJobListing, deleteJobListing } from '../../lib/supabase';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [currentJob, setCurrentJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    responsibilities: ['', '', '', '', ''],
    requirements: ['', '', '', '', '']
  });
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await fetchJobListings();
      
      if (error) throw error;
      
      // Sort jobs by creation date (newest first)
      const sortedJobs = data ? [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
      setJobs(sortedJobs);
    } catch (err) {
      console.error('Error fetching job listings:', err);
      setError('Failed to load job listings. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type, job = null) => {
    setModalType(type);
    
    if (type === 'create') {
      setJobForm({
        title: '',
        location: '',
        type: 'Full-time',
        salary: '',
        description: '',
        responsibilities: ['', '', '', '', ''],
        requirements: ['', '', '', '', '']
      });
    } else if (type === 'edit' && job) {
      // Ensure responsibilities and requirements arrays have 5 items
      const responsibilities = job.responsibilities || [];
      const requirements = job.requirements || [];
      const paddedResponsibilities = [...responsibilities, ...Array(5 - responsibilities.length).fill('')].slice(0, 5);
      const paddedRequirements = [...requirements, ...Array(5 - requirements.length).fill('')].slice(0, 5);
      
      setJobForm({
        title: job.title || '',
        location: job.location || '',
        type: job.type || 'Full-time',
        salary: job.salary || '',
        description: job.description || '',
        responsibilities: paddedResponsibilities,
        requirements: paddedRequirements
      });
      setCurrentJob(job);
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm({ ...jobForm, [name]: value });
  };

  const handleArrayChange = (arrayName, index, value) => {
    const newArray = [...jobForm[arrayName]];
    newArray[index] = value;
    setJobForm({ ...jobForm, [arrayName]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Filter out empty items from responsibilities and requirements
      const filteredResponsibilities = jobForm.responsibilities.filter(item => item.trim() !== '');
      const filteredRequirements = jobForm.requirements.filter(item => item.trim() !== '');
      
      // Add current date if creating new job
      const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const jobData = {
        ...jobForm,
        responsibilities: filteredResponsibilities,
        requirements: filteredRequirements,
        date_posted: modalType === 'create' ? now : currentJob?.date_posted || now
      };
      
      if (modalType === 'create') {
        const { error } = await createJobListing(jobData);
        if (error) throw error;
        setSuccessMessage('Job listing created successfully!');
      } else if (modalType === 'edit' && currentJob) {
        const { error } = await updateJobListing(currentJob.id, jobData);
        if (error) throw error;
        setSuccessMessage('Job listing updated successfully!');
      }
      
      // Refresh the jobs list
      await fetchAllJobs();
      
      // Close the modal after a delay to show success message
      setTimeout(() => {
        handleCloseModal();
        setSuccessMessage(null);
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting job listing:', err);
      setError('Failed to save job listing. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await deleteJobListing(job.id);
      if (error) throw error;
      
      // Refresh the jobs list
      await fetchAllJobs();
      setSuccessMessage('Job listing deleted successfully!');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error deleting job listing:', err);
      setError('Failed to delete job listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-light">Careers Management</h1>
        <button
          onClick={() => handleOpenModal('create')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-secondary-600 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-secondary-500"
        >
          <FiPlus className="mr-2 -ml-1 h-5 w-5" />
          Add Job Listing
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

      {/* Jobs List */}
      <div className="bg-white dark:bg-dark-lighter shadow overflow-hidden rounded-md">
        {loading ? (
          <div className="p-6 text-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-600 dark:text-secondary-400" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading job listings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-10 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-light">No job listings</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new job listing.</p>
            <div className="mt-6">
              <button
                onClick={() => handleOpenModal('create')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-secondary-600 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-secondary-500"
              >
                <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                Add Job Listing
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {jobs.map((job) => (
              <motion.li 
                key={job.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-light">{job.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FiMapPin className="mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FiClock className="mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          {job.type}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FiDollarSign className="mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          {job.salary}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FiBriefcase className="mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          Posted: {new Date(job.date_posted).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenModal('edit', job)}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job)}
                        className="p-2 text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-light-darker line-clamp-2">{job.description}</p>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-light-dark mb-1">Responsibilities:</h4>
                        <ul className="text-sm text-gray-600 dark:text-light-darker space-y-1">
                          {job.responsibilities && job.responsibilities.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary-600 dark:text-secondary-400 mr-1.5">&bull;</span>
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-light-dark mb-1">Requirements:</h4>
                        <ul className="text-sm text-gray-600 dark:text-light-darker space-y-1">
                          {job.requirements && job.requirements.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-primary-600 dark:text-secondary-400 mr-1.5">&bull;</span>
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

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
                      {modalType === 'create' ? 'Add New Job Listing' : 'Edit Job Listing'}
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
                          Job Title*
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={jobForm.title}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Location */}
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Location*
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="location"
                              id="location"
                              required
                              placeholder="e.g., New York, NY"
                              value={jobForm.location}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                            />
                          </div>
                        </div>

                        {/* Job Type */}
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                            Job Type*
                          </label>
                          <div className="mt-1">
                            <select
                              id="type"
                              name="type"
                              required
                              value={jobForm.type}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                            >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Contract">Contract</option>
                              <option value="Internship">Internship</option>
                              <option value="Remote">Remote</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Salary */}
                      <div>
                        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                          Salary Range*
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="salary"
                            id="salary"
                            required
                            placeholder="e.g., $80,000 - $100,000"
                            value={jobForm.salary}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                          Job Description*
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows="4"
                            required
                            value={jobForm.description}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          ></textarea>
                        </div>
                      </div>

                      {/* Responsibilities */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-light-dark mb-2">
                          Responsibilities
                        </label>
                        <div className="space-y-2">
                          {jobForm.responsibilities.map((responsibility, index) => (
                            <input
                              key={index}
                              type="text"
                              placeholder={`Responsibility ${index + 1}`}
                              value={responsibility}
                              onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-light-dark mb-2">
                          Requirements
                        </label>
                        <div className="space-y-2">
                          {jobForm.requirements.map((requirement, index) => (
                            <input
                              key={index}
                              type="text"
                              placeholder={`Requirement ${index + 1}`}
                              value={requirement}
                              onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-dark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
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

export default Careers;