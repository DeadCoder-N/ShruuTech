import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle, FiCheck, FiShield, FiLock, FiActivity, FiCode, FiClipboard, FiUsers } from 'react-icons/fi';
import { fetchServices, createService, updateService, deleteService } from '../../lib/supabase';

const iconOptions = [
  { value: 'shield', label: 'Shield', icon: <FiShield size={20} /> },
  { value: 'lock', label: 'Lock', icon: <FiLock size={20} /> },
  { value: 'radar', label: 'Radar', icon: <FiActivity size={20} /> },
  { value: 'code', label: 'Code', icon: <FiCode size={20} /> },
  { value: 'clipboard', label: 'Clipboard', icon: <FiClipboard size={20} /> },
  { value: 'users', label: 'Users', icon: <FiUsers size={20} /> }
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [currentService, setCurrentService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    icon_name: 'shield',
    features: ['', '', '', '', '']
  });
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchAllServices();
  }, []);

  const fetchAllServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await fetchServices();
      
      if (error) throw error;
      
      // Sort services by creation date (newest first)
      const sortedServices = data ? [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
      setServices(sortedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type, service = null) => {
    setModalType(type);
    
    if (type === 'create') {
      setServiceForm({
        title: '',
        description: '',
        icon_name: 'shield',
        features: ['', '', '', '', '']
      });
    } else if (type === 'edit' && service) {
      // Ensure features array has 5 items
      const features = service.features || [];
      const paddedFeatures = [...features, ...Array(5 - features.length).fill('')].slice(0, 5);
      
      setServiceForm({
        title: service.title || '',
        description: service.description || '',
        icon_name: service.icon_name || 'shield',
        features: paddedFeatures
      });
      setCurrentService(service);
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceForm({ ...serviceForm, [name]: value });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...serviceForm.features];
    newFeatures[index] = value;
    setServiceForm({ ...serviceForm, features: newFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Filter out empty features
      const filteredFeatures = serviceForm.features.filter(feature => feature.trim() !== '');
      
      const serviceData = {
        title: serviceForm.title,
        description: serviceForm.description,
        icon_name: serviceForm.icon_name,
        features: filteredFeatures
      };
      
      if (modalType === 'create') {
        const { error } = await createService(serviceData);
        if (error) throw error;
        setSuccessMessage('Service created successfully!');
      } else if (modalType === 'edit' && currentService) {
        const { error } = await updateService(currentService.id, serviceData);
        if (error) throw error;
        setSuccessMessage('Service updated successfully!');
      }
      
      // Refresh the services list
      await fetchAllServices();
      
      // Close the modal after a delay to show success message
      setTimeout(() => {
        handleCloseModal();
        setSuccessMessage(null);
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting service:', err);
      setError('Failed to save service. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (service) => {
    if (!window.confirm(`Are you sure you want to delete "${service.title}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await deleteService(service.id);
      if (error) throw error;
      
      // Refresh the services list
      await fetchAllServices();
      setSuccessMessage('Service deleted successfully!');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-light">Services Management</h1>
        <button
          onClick={() => handleOpenModal('create')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-secondary-600 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-secondary-500"
        >
          <FiPlus className="mr-2 -ml-1 h-5 w-5" />
          Add Service
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

      {/* Services List */}
      <div className="bg-white dark:bg-dark-lighter shadow overflow-hidden rounded-md">
        {loading ? (
          <div className="p-6 text-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary-600 dark:text-secondary-400" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="p-10 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-light">No services</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new service.</p>
            <div className="mt-6">
              <button
                onClick={() => handleOpenModal('create')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-secondary-600 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-secondary-500"
              >
                <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                Add Service
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {services.map((service) => (
              <motion.li 
                key={service.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 py-5 flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary-100 dark:bg-dark flex items-center justify-center text-primary-600 dark:text-secondary-400">
                      {getIconComponent(service.icon_name)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-light">{service.title}</h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400 line-clamp-2 max-w-2xl">{service.description}</p>
                      {service.features && service.features.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-light-dark">Features:</p>
                          <ul className="mt-1 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                            {service.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-1.5 text-primary-600 dark:text-secondary-400">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenModal('edit', service)}
                      className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service)}
                      className="p-2 text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
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
                      {modalType === 'create' ? 'Add New Service' : 'Edit Service'}
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
                            value={serviceForm.title}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          />
                        </div>
                      </div>

                      {/* Icon */}
                      <div>
                        <label htmlFor="icon_name" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                          Icon
                        </label>
                        <div className="mt-1">
                          <select
                            name="icon_name"
                            id="icon_name"
                            value={serviceForm.icon_name}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          >
                            {iconOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Preview:</span>
                          <div className="p-2 bg-primary-100 dark:bg-dark rounded-md text-primary-600 dark:text-secondary-400">
                            {getIconComponent(serviceForm.icon_name)}
                          </div>
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
                            value={serviceForm.description}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                          ></textarea>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                          Features
                        </label>
                        <div className="mt-1 space-y-2">
                          {serviceForm.features.map((feature, index) => (
                            <input
                              key={index}
                              type="text"
                              placeholder={`Feature ${index + 1}`}
                              value={feature}
                              onChange={(e) => handleFeatureChange(index, e.target.value)}
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                            />
                          ))}
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter up to 5 key features of this service</p>
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

// Helper function to get icon component by name
const getIconComponent = (iconName) => {
  switch(iconName) {
    case 'shield': return <FiShield size={20} />;
    case 'lock': return <FiLock size={20} />;
    case 'radar': return <FiActivity size={20} />;
    case 'code': return <FiCode size={20} />;
    case 'clipboard': return <FiClipboard size={20} />;
    case 'users': return <FiUsers size={20} />;
    default: return <FiShield size={20} />;
  }
};

export default Services;