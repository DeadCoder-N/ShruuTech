import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiActivity, FiCode, FiClipboard, FiUsers } from 'react-icons/fi';
import { fetchServices } from '../lib/supabase';

const initialServices = [
  {
    id: 1,
    icon: <FiShield size={36} />,
    title: 'Network Security',
    description: 'Protect your network infrastructure with advanced firewalls, intrusion detection systems, and 24/7 monitoring. We ensure your network is secure against unauthorized access and cyber threats.',
    features: [
      'Advanced firewall configuration',
      'Intrusion detection systems',
      '24/7 network monitoring',
      'VPN setup and management',
      'Network vulnerability assessment'
    ]
  },
  {
    id: 2,
    icon: <FiLock size={36} />,
    title: 'Data Protection',
    description: 'Safeguard your sensitive data with state-of-the-art encryption, comprehensive access controls, and robust data management policies tailored to your organization\'s needs.',
    features: [
      'Data encryption at rest and in transit',
      'Access control implementation',
      'Data loss prevention strategies',
      'Secure backup solutions',
      'Compliance with data protection regulations'
    ]
  },
  {
    id: 3,
    icon: <FiActivity size={36} />,
    title: 'Threat Intelligence',
    description: 'Stay ahead of emerging threats with our proactive intelligence gathering and analysis. We identify and neutralize potential security risks before they impact your business.',
    features: [
      'Real-time threat monitoring',
      'Advanced threat hunting',
      'Security incident response',
      'Threat pattern analysis',
      'Intelligence reporting and recommendations'
    ]
  },
  {
    id: 4,
    icon: <FiCode size={36} />,
    title: 'Secure Development',
    description: 'Integrate security into your development lifecycle with our specialized secure coding practices and application security testing services.',
    features: [
      'Secure code reviews',
      'Application penetration testing',
      'DevSecOps implementation',
      'API security assessment',
      'Security architecture consulting'
    ]
  },
  {
    id: 5,
    icon: <FiClipboard size={36} />,
    title: 'Security Audits',
    description: 'Comprehensive assessment of your security posture to identify vulnerabilities and provide actionable remediation recommendations.',
    features: [
      'Comprehensive security assessments',
      'Regulatory compliance audits',
      'Vulnerability scanning',
      'Security policy review',
      'Risk management recommendations'
    ]
  },
  {
    id: 6,
    icon: <FiUsers size={36} />,
    title: 'Security Training',
    description: 'Empower your team with the knowledge and skills to recognize and respond to security threats through our specialized training programs.',
    features: [
      'Security awareness training',
      'Phishing simulation exercises',
      'Incident response drills',
      'Role-based security training',
      'Executive security briefings'
    ]
  }
];

const Services = () => {
  const [services, setServices] = useState(initialServices);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const getServices = async () => {
      try {
        const { data, error } = await fetchServices();
        if (error) throw error;
        if (data && data.length > 0) {
          // Merge with initial services if needed
          setServices(prevServices => {
            const dbServices = data.map(dbService => ({
              id: dbService.id,
              icon: getIconByName(dbService.icon_name),
              title: dbService.title,
              description: dbService.description,
              features: dbService.features || []
            }));
            return [...dbServices];
          });
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    getServices();
  }, []);

  const getIconByName = (iconName) => {
    switch(iconName) {
      case 'shield': return <FiShield size={36} />;
      case 'lock': return <FiLock size={36} />;
      case 'radar': return <FiActivity size={36} />;
      case 'code': return <FiCode size={36} />;
      case 'clipboard': return <FiClipboard size={36} />;
      case 'users': return <FiUsers size={36} />;
      default: return <FiShield size={36} />;
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFormData({
      ...formData,
      service: service.title
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          service: selectedService ? selectedService.title : '',
          message: ''
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-dark-light to-dark dark:from-dark dark:to-dark-lighter text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Security Services
            </motion.h1>
            <motion.p 
              className="text-xl text-light-dark mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Comprehensive cybersecurity solutions designed to protect your business from evolving threats.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                className="bg-white dark:bg-dark-lighter shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-dark flex items-center justify-center mb-6 text-primary-600 dark:text-secondary-400">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-light">{service.title}</h3>
                  <p className="mb-6 text-gray-600 dark:text-light-darker">{service.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-light-dark">Key Features:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 text-primary-600 dark:text-secondary-400">✓</span>
                          <span className="text-gray-600 dark:text-light-darker">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => handleServiceSelect(service)}
                    className="btn btn-primary w-full"
                  >
                    Request Consultation
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-light mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Our Security Process
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-light-darker"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              How we approach securing your organization
            </motion.p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Assessment', description: 'We begin with a comprehensive assessment of your current security posture.' },
              { step: '02', title: 'Strategy', description: 'Based on the assessment, we develop a tailored security strategy for your organization.' },
              { step: '03', title: 'Implementation', description: 'Our experts implement the security measures and controls defined in the strategy.' },
              { step: '04', title: 'Monitoring', description: 'Continuous monitoring and regular reviews ensure your security remains effective.' }
            ].map((process, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-dark-lighter flex items-center justify-center text-primary-600 dark:text-secondary-400 text-2xl font-bold mx-auto mb-6">
                  {process.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-light">{process.title}</h3>
                <p className="text-gray-600 dark:text-light-darker">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-dark-lighter text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Need a Customized Security Solution?
          </motion.h2>
          <motion.p 
            className="text-xl mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Our security experts are ready to help you design a comprehensive security strategy tailored to your specific needs.
          </motion.p>
          <motion.button
            className="btn bg-white text-primary-700 dark:text-dark-light hover:bg-gray-100 transition-all"
            onClick={() => setShowModal(true)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Contact Our Team
          </motion.button>
        </div>
      </section>

      {/* Consultation Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

            <motion.div 
              className="inline-block align-bottom bg-white dark:bg-dark-lighter rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-light">
                      Request a Consultation
                    </h3>
                    
                    {submitSuccess ? (
                      <div className="mt-6 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                          <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-light">Thank you!</h3>
                        <p className="mt-2 text-gray-600 dark:text-light-darker">
                          Your consultation request has been received. We'll contact you shortly.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="mt-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                              Full Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                              Email
                            </label>
                            <div className="mt-1">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                              Company
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="company"
                                id="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                              Service
                            </label>
                            <div className="mt-1">
                              <select
                                id="service"
                                name="service"
                                value={formData.service}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                              >
                                <option value="">Select a service</option>
                                {services.map(service => (
                                  <option key={service.id} value={service.title}>
                                    {service.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                              Message
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="message"
                                name="message"
                                rows="4"
                                value={formData.message}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                              ></textarea>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 sm:flex sm:justify-end">
                          <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="btn border border-gray-300 text-gray-700 dark:text-light dark:border-gray-600 mr-2"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                          >
                            {isSubmitting ? 'Sending...' : 'Submit Request'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;