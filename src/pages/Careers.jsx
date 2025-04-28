import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiBriefcase, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { fetchJobListings } from '../lib/supabase';

// Initial job listings data
const initialJobs = [
  {
    id: 1,
    title: 'Senior Security Analyst',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$110,000 - $130,000',
    description: 'We are seeking an experienced Security Analyst to join our threat intelligence team. In this role, you will analyze security threats, investigate incidents, and develop security strategies to protect our clients from evolving cyber threats.',
    responsibilities: [
      'Monitor and analyze security alerts from multiple sources',
      'Conduct threat hunting to identify potential security breaches',
      'Develop security policies and procedures',
      'Perform incident response and forensic investigations',
      'Create detailed reports on security findings and recommendations'
    ],
    requirements: [
      '5+ years of experience in cybersecurity',
      'CISSP, GIAC, or equivalent certification',
      'Experience with SIEM tools and threat intelligence platforms',
      'Strong understanding of network security and vulnerability assessment',
      'Excellent analytical and problem-solving skills'
    ],
    date_posted: '2025-04-01'
  },
  {
    id: 2,
    title: 'Penetration Tester',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$100,000 - $125,000',
    description: 'Join our offensive security team to identify vulnerabilities in our clients\' systems and networks. You will conduct penetration tests, assess security measures, and provide recommendations for improvement.',
    responsibilities: [
      'Perform network, web application, and mobile application penetration tests',
      'Identify and exploit security vulnerabilities',
      'Document findings and create comprehensive reports',
      'Develop and maintain testing methodologies',
      'Present findings to technical and non-technical stakeholders'
    ],
    requirements: [
      '3+ years of experience in penetration testing',
      'CEH, OSCP, or equivalent certification',
      'Proficiency in scripting languages (Python, Bash)',
      'Knowledge of common security tools (Metasploit, Burp Suite, etc.)',
      'Understanding of network protocols and web technologies'
    ],
    date_posted: '2025-03-25'
  },
  {
    id: 3,
    title: 'Cloud Security Engineer',
    location: 'Remote',
    type: 'Full-time',
    salary: '$115,000 - $135,000',
    description: 'We are looking for a Cloud Security Engineer to help secure our clients\' cloud environments. You will develop and implement security solutions for cloud infrastructure and ensure compliance with security standards.',
    responsibilities: [
      'Design and implement security controls for cloud environments (AWS, Azure, GCP)',
      'Develop and maintain cloud security architecture',
      'Conduct security assessments of cloud infrastructure',
      'Automate security processes and controls',
      'Monitor cloud environments for security threats'
    ],
    requirements: [
      '4+ years of experience in cloud security',
      'AWS, Azure, or GCP certification',
      'Experience with infrastructure as code (Terraform, CloudFormation)',
      'Knowledge of container security (Docker, Kubernetes)',
      'Strong scripting and automation skills'
    ],
    date_posted: '2025-03-20'
  },
  {
    id: 4,
    title: 'Security Compliance Specialist',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: '$90,000 - $110,000',
    description: 'Join our compliance team to ensure our clients meet regulatory requirements and industry standards. You will conduct audits, assess compliance, and develop policies to maintain security posture.',
    responsibilities: [
      'Conduct security compliance assessments and audits',
      'Develop and maintain security policies and procedures',
      'Monitor and ensure compliance with regulatory requirements (GDPR, HIPAA, PCI DSS)',
      'Coordinate with internal teams to remediate compliance gaps',
      'Prepare documentation for compliance certifications'
    ],
    requirements: [
      '3+ years of experience in security compliance',
      'CISA, CRISC, or equivalent certification',
      'Knowledge of regulatory frameworks and industry standards',
      'Experience with compliance management tools',
      'Strong attention to detail and documentation skills'
    ],
    date_posted: '2025-03-15'
  },
  {
    id: 5,
    title: 'Security Operations Center (SOC) Analyst',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$80,000 - $95,000',
    description: 'We are seeking a SOC Analyst to join our 24/7 security operations center. You will monitor security events, investigate alerts, and respond to security incidents to protect our clients\' systems and data.',
    responsibilities: [
      'Monitor security events and alerts in real-time',
      'Investigate and triage security incidents',
      'Follow incident response procedures',
      'Document security incidents and actions taken',
      'Collaborate with other security teams to resolve incidents'
    ],
    requirements: [
      '2+ years of experience in security operations',
      'CompTIA Security+ or equivalent certification',
      'Experience with SIEM tools and security monitoring systems',
      'Understanding of network protocols and security concepts',
      'Ability to work in shifts, including nights and weekends'
    ],
    date_posted: '2025-03-10'
  },
  {
    id: 6,
    title: 'Security Awareness Trainer',
    location: 'Remote',
    type: 'Part-time',
    salary: '$75,000 - $90,000',
    description: 'Join our team as a Security Awareness Trainer to develop and deliver security training programs for our clients. You will create engaging content, conduct training sessions, and help build a security-conscious culture.',
    responsibilities: [
      'Develop security awareness training materials and programs',
      'Conduct in-person and virtual training sessions',
      'Create phishing simulations and other security tests',
      'Measure and report on training effectiveness',
      'Stay updated on emerging security threats and trends'
    ],
    requirements: [
      '2+ years of experience in security awareness training',
      'Strong communication and presentation skills',
      'Knowledge of social engineering techniques',
      'Experience with learning management systems',
      'Creative problem-solving and engagement strategies'
    ],
    date_posted: '2025-03-05'
  }
];

const Careers = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: '',
    jobTitle: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [filters, setFilters] = useState({
    location: 'all',
    type: 'all'
  });

  useEffect(() => {
    const getJobs = async () => {
      try {
        const { data, error } = await fetchJobListings();
        if (error) throw error;
        if (data && data.length > 0) {
          // Use database jobs if available
          setJobs(data);
          setFilteredJobs(data);
        }
      } catch (error) {
        console.error('Error fetching job listings:', error);
      }
    };

    getJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, jobs]);

  const applyFilters = () => {
    let filtered = [...jobs];
    
    // Apply location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(job => job.location === filters.location);
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(job => job.type === filters.type);
    }
    
    setFilteredJobs(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setFormData({
      ...formData,
      jobTitle: job.title
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setFormData({
      ...formData,
      jobTitle: job.title
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      resume: file
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
          phone: '',
          resume: null,
          coverLetter: '',
          jobTitle: selectedJob ? selectedJob.title : ''
        });
      }, 3000);
    }, 1500);
  };

  // Get unique locations for filter
  const locations = ['all', ...new Set(jobs.map(job => job.location))];

  // Get unique job types for filter
  const jobTypes = ['all', ...new Set(jobs.map(job => job.type))];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-dark-light to-dark dark:from-dark dark:to-dark-lighter text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Join Our Security Team
            </motion.h1>
            <motion.p 
              className="text-xl text-light-dark mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Build your career at the forefront of cybersecurity with ShruuTech
            </motion.p>
          </div>
        </div>
      </section>

      {/* Job Detail Section (conditionally rendered) */}
      {selectedJob && (
        <section className="py-16 bg-white dark:bg-dark-light">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-dark-lighter rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-light">{selectedJob.title}</h2>
                    <button
                      onClick={() => handleApplyClick(selectedJob)}
                      className="mt-4 md:mt-0 btn btn-primary"
                    >
                      Apply Now
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="flex items-center">
                      <FiMapPin className="mr-2 text-primary-600 dark:text-secondary-400" />
                      <span className="text-gray-700 dark:text-light-dark">{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-primary-600 dark:text-secondary-400" />
                      <span className="text-gray-700 dark:text-light-dark">{selectedJob.type}</span>
                    </div>
                    <div className="flex items-center">
                      <FiDollarSign className="mr-2 text-primary-600 dark:text-secondary-400" />
                      <span className="text-gray-700 dark:text-light-dark">{selectedJob.salary}</span>
                    </div>
                    <div className="flex items-center">
                      <FiBriefcase className="mr-2 text-primary-600 dark:text-secondary-400" />
                      <span className="text-gray-700 dark:text-light-dark">
                        Posted: {new Date(selectedJob.date_posted).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-light mb-4">Job Description</h3>
                      <p className="text-gray-700 dark:text-light-dark">{selectedJob.description}</p>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-light mb-4">Responsibilities</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-light-dark">
                        {selectedJob.responsibilities.map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-light mb-4">Requirements</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-light-dark">
                        {selectedJob.requirements.map((requirement, index) => (
                          <li key={index}>{requirement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="btn border border-gray-300 text-gray-700 dark:text-light mb-4 sm:mb-0"
                      >
                        Back to Job Listings
                      </button>
                      <button
                        onClick={() => handleApplyClick(selectedJob)}
                        className="btn btn-primary"
                      >
                        Apply for this Position
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Job Listings Section */}
      <section className={`py-16 bg-gray-50 dark:bg-dark ${selectedJob ? 'hidden' : 'block'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-light mb-2">Open Positions</h2>
                <p className="text-gray-600 dark:text-light-darker">Join our team of security experts and make a difference</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
                {/* Location filter */}
                <select
                  className="px-3 py-2 bg-white dark:bg-dark-lighter border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-light-dark focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-secondary-400"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  {locations.map((location, index) => (
                    <option key={index} value={location}>
                      {location === 'all' ? 'All Locations' : location}
                    </option>
                  ))}
                </select>
                
                {/* Job type filter */}
                <select
                  className="px-3 py-2 bg-white dark:bg-dark-lighter border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-light-dark focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-secondary-400"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  {jobTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {filteredJobs.length > 0 ? (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <motion.div 
                    key={job.id}
                    className="bg-white dark:bg-dark-lighter rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-light">{job.title}</h3>
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="flex items-center text-gray-600 dark:text-light-darker">
                              <FiMapPin className="mr-1 text-primary-600 dark:text-secondary-400" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-light-darker">
                              <FiClock className="mr-1 text-primary-600 dark:text-secondary-400" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-light-darker">
                              <FiDollarSign className="mr-1 text-primary-600 dark:text-secondary-400" />
                              <span>{job.salary}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-4">
                          <button
                            onClick={() => handleJobSelect(job)}
                            className="flex items-center text-primary-600 dark:text-secondary-400 hover:text-primary-700 dark:hover:text-secondary-500 font-medium"
                          >
                            View Details <FiArrowRight className="ml-1" />
                          </button>
                          <button
                            onClick={() => handleApplyClick(job)}
                            className="btn btn-primary"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                      <p className="mt-4 text-gray-600 dark:text-light-darker line-clamp-2">{job.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-lighter rounded-lg shadow-md p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-light mb-2">No matching positions</h3>
                <p className="text-gray-600 dark:text-light-darker">
                  We couldn't find any positions matching your filters. Please try different criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 bg-white dark:bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-light mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                Why Join ShruuTech Security?
              </motion.h2>
              <motion.p 
                className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-light-darker"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                Build your career with a leader in cybersecurity
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Cutting-Edge Technology',
                  description: 'Work with the latest security tools and technologies to solve complex challenges.',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                },
                {
                  title: 'Continuous Learning',
                  description: 'Access to training, certifications, and development opportunities to advance your skills.',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                },
                {
                  title: 'Collaborative Environment',
                  description: 'Join a team of experts who work together to solve the most challenging security problems.',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                },
                {
                  title: 'Work-Life Balance',
                  description: 'Flexible work arrangements and policies that respect your time outside of work.',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                },
                {
                  title: 'Competitive Benefits',
                  description: 'Comprehensive health benefits, retirement plans, and competitive compensation packages.',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                },
                {
                  title: 'Career Growth',
                  description: 'Clear career paths and opportunities for advancement within the organization.',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                }
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 dark:bg-dark p-8 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="flex justify-center mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-light mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-light-darker">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Alert Section */}
      <section className="py-16 bg-primary-600 dark:bg-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Don't See the Right Fit?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Sign up for job alerts and be the first to know when new positions open up.
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
                className="px-4 py-3 flex-grow sm:max-w-xs rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                required
              />
              <button type="submit" className="px-6 py-3 bg-white text-primary-700 dark:text-dark-light font-medium rounded-md hover:bg-gray-100 transition-colors">
                Subscribe to Job Alerts
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Application Modal */}
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
                      Apply for {selectedJob?.title}
                    </h3>
                    
                    {submitSuccess ? (
                      <div className="mt-6 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                          <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-light">Application Submitted!</h3>
                        <p className="mt-2 text-gray-600 dark:text-light-darker">
                          Thank you for your interest. We'll review your application and get back to you soon.
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
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                              Phone
                            </label>
                            <div className="mt-1">
                              <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                              Position
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="jobTitle"
                                id="jobTitle"
                                readOnly
                                value={formData.jobTitle}
                                className="bg-gray-50 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                              Resume/CV
                            </label>
                            <div className="mt-1">
                              <input
                                type="file"
                                name="resume"
                                id="resume"
                                required
                                onChange={handleFileChange}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                              />
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">PDF, DOC, or DOCX up to 5MB</p>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                              Cover Letter
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="coverLetter"
                                name="coverLetter"
                                rows="4"
                                placeholder="Tell us why you're interested in this position"
                                value={formData.coverLetter}
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
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
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

export default Careers;