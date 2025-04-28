import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMonitor, FiDollarSign, FiUsers, FiUser } from 'react-icons/fi';
import { fetchCourses } from '../lib/supabase';

const initialCourses = [
  {
    id: 1,
    title: 'Network Security Fundamentals',
    description: 'Learn the essential concepts and practices of network security to protect your organization from cyber threats.',
    image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '4 weeks',
    schedule: 'Mon & Wed',
    timing: '6:00 PM - 8:00 PM',
    mode: 'Online',
    fees: '$599',
    batch: 'Starts June 15, 2025',
    trainer: 'John Smith, CISSP'
  },
  {
    id: 2,
    title: 'Ethical Hacking and Penetration Testing',
    description: 'Master the skills to identify and exploit vulnerabilities in systems, and learn how to secure them effectively.',
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '8 weeks',
    schedule: 'Tue & Thu',
    timing: '7:00 PM - 9:00 PM',
    mode: 'Hybrid',
    fees: '$1,299',
    batch: 'Starts July 5, 2025',
    trainer: 'Emily Chen, CEH'
  },
  {
    id: 3,
    title: 'Cybersecurity Risk Management',
    description: 'Develop strategies to identify, assess, and mitigate security risks to protect your organization\'s digital assets.',
    image: 'https://images.pexels.com/photos/5380659/pexels-photo-5380659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '6 weeks',
    schedule: 'Fridays',
    timing: '9:00 AM - 1:00 PM',
    mode: 'In-person',
    fees: '$899',
    batch: 'Starts August 4, 2025',
    trainer: 'Robert Johnson, CISM'
  },
  {
    id: 4,
    title: 'Cloud Security Architecture',
    description: 'Learn how to design, implement and manage secure cloud environments across major cloud platforms.',
    image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '5 weeks',
    schedule: 'Mon, Wed, Fri',
    timing: '5:00 PM - 6:30 PM',
    mode: 'Online',
    fees: '$799',
    batch: 'Starts June 20, 2025',
    trainer: 'Sarah Williams, CCSP'
  },
  {
    id: 5,
    title: 'Security Operations Center (SOC) Analyst Training',
    description: 'Comprehensive training for SOC analysts covering threat detection, incident response, and security monitoring.',
    image: 'https://images.pexels.com/photos/3345882/pexels-photo-3345882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '10 weeks',
    schedule: 'Tue & Thu',
    timing: '6:00 PM - 8:30 PM',
    mode: 'Hybrid',
    fees: '$1,699',
    batch: 'Starts July 11, 2025',
    trainer: 'David Park, GIAC GSEC'
  },
  {
    id: 6,
    title: 'Advanced Malware Analysis',
    description: 'Deep dive into malware analysis techniques, including static and dynamic analysis to understand and counter threats.',
    image: 'https://images.pexels.com/photos/6969866/pexels-photo-6969866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '8 weeks',
    schedule: 'Saturdays',
    timing: '10:00 AM - 2:00 PM',
    mode: 'Online',
    fees: '$1,499',
    batch: 'Starts August 8, 2025',
    trainer: 'Melissa Chang, GREM'
  }
];

const Courses = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const getCourses = async () => {
      try {
        const { data, error } = await fetchCourses();
        if (error) throw error;
        if (data && data.length > 0) {
          // Use database courses if available
          setCourses(data.map(course => ({
            ...course,
            image: course.image || initialCourses.find(c => c.title === course.title)?.image
          })));
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    getCourses();
  }, []);

  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(course => course.mode.toLowerCase() === filter.toLowerCase());

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setFormData({
      ...formData,
      course: course.title
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
          phone: '',
          course: selectedCourse ? selectedCourse.title : '',
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
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Security Training Courses
            </motion.h1>
            <motion.p 
              className="text-xl text-light-dark mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Enhance your cybersecurity skills with our expert-led courses designed for professionals at all levels.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white dark:bg-dark-light border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 dark:bg-secondary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-lighter text-gray-700 dark:text-light-dark hover:bg-gray-200 dark:hover:bg-dark'
              }`}
            >
              All Courses
            </button>
            <button 
              onClick={() => setFilter('online')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'online'
                  ? 'bg-primary-600 dark:bg-secondary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-lighter text-gray-700 dark:text-light-dark hover:bg-gray-200 dark:hover:bg-dark'
              }`}
            >
              Online
            </button>
            <button 
              onClick={() => setFilter('hybrid')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'hybrid'
                  ? 'bg-primary-600 dark:bg-secondary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-lighter text-gray-700 dark:text-light-dark hover:bg-gray-200 dark:hover:bg-dark'
              }`}
            >
              Hybrid
            </button>
            <button 
              onClick={() => setFilter('in-person')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'in-person'
                  ? 'bg-primary-600 dark:bg-secondary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-lighter text-gray-700 dark:text-light-dark hover:bg-gray-200 dark:hover:bg-dark'
              }`}
            >
              In-Person
            </button>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-gray-50 dark:bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <motion.div 
                key={course.id}
                className="bg-white dark:bg-dark-lighter shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-light">{course.title}</h3>
                  <p className="mb-6 text-gray-600 dark:text-light-darker">{course.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600 dark:text-light-darker">
                      <FiCalendar className="mr-2 text-primary-600 dark:text-secondary-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-light-darker">
                      <FiClock className="mr-2 text-primary-600 dark:text-secondary-400" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-light-darker">
                      <FiMonitor className="mr-2 text-primary-600 dark:text-secondary-400" />
                      <span>{course.mode}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-light-darker">
                      <FiDollarSign className="mr-2 text-primary-600 dark:text-secondary-400" />
                      <span>{course.fees}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-light-darker col-span-2">
                      <FiUsers className="mr-2 text-primary-600 dark:text-secondary-400" />
                      <span>{course.batch}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-light-darker col-span-2">
                      <FiUser className="mr-2 text-primary-600 dark:text-secondary-400" />
                      <span>{course.trainer}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCourseSelect(course)}
                    className="btn btn-primary w-full"
                  >
                    Enroll Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-light mb-2">No courses found</h3>
              <p className="text-gray-600 dark:text-light-darker">
                No courses match your current filter. Please try a different filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-light mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Student Testimonials
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-light-darker"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              What our graduates have to say about our courses
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The Network Security course was excellent. I applied what I learned immediately at my job.",
                name: "James Wilson",
                position: "Network Administrator",
                image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                quote: "Ethical Hacking transformed my understanding of security vulnerabilities. Highly recommended!",
                name: "Lisa Chen",
                position: "Security Analyst",
                image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                quote: "The instructors are industry experts who provided practical insights beyond the curriculum.",
                name: "Michael Rodriguez",
                position: "IT Director",
                image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 dark:bg-dark p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-light">{testimonial.name}</h4>
                    <p className="text-gray-600 dark:text-light-darker">{testimonial.position}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-light-darker italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-dark-light dark:to-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Ready to Advance Your Security Career?
          </motion.h2>
          <motion.p 
            className="text-xl mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Enroll in our courses today and gain the skills and certifications needed to excel in the cybersecurity field.
          </motion.p>
          <motion.button
            className="btn bg-white text-primary-700 dark:text-dark-light hover:bg-gray-100 transition-all"
            onClick={() => window.scrollTo(0, 0)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            View All Courses
          </motion.button>
        </div>
      </section>

      {/* Enrollment Modal */}
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
                      Enroll in {selectedCourse?.title}
                    </h3>
                    
                    {submitSuccess ? (
                      <div className="mt-6 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                          <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-light">Enrollment Successful!</h3>
                        <p className="mt-2 text-gray-600 dark:text-light-darker">
                          Thank you for enrolling. We'll contact you with detailed information about the course.
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
                            <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                              Course
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="course"
                                id="course"
                                readOnly
                                value={formData.course}
                                className="bg-gray-50 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md dark:bg-dark dark:border-gray-600 dark:text-light"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-light-dark">
                              Additional Information
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="message"
                                name="message"
                                rows="3"
                                placeholder="Any questions or special requirements?"
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
                            {isSubmitting ? 'Processing...' : 'Enroll Now'}
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

export default Courses;