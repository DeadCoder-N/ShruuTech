import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiShield, FiLock, FiDatabase, FiActivity, FiUsers, FiAward } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { darkMode } = useTheme();
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const trustRef = useRef(null);
  
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.3 });
  const trustInView = useInView(trustRef, { once: true, amount: 0.3 });

  const services = [
    {
      icon: FiShield,
      title: 'Network Security',
      description: 'Protect your network infrastructure with advanced firewalls, intrusion detection, and 24/7 monitoring services.',
      link: '/services'
    },
    {
      icon: FiLock,
      title: 'Data Protection',
      description: 'Secure your sensitive data with encryption, access controls, and comprehensive data security policies.',
      link: '/services'
    },
    {
      icon: FiActivity,
      title: 'Threat Intelligence',
      description: 'Stay ahead of emerging threats with proactive intelligence gathering and analysis of potential security risks.',
      link: '/services'
    }
  ];

  const stats = [
    { value: '500+', label: 'Clients Protected' },
    { value: '99.9%', label: 'Uptime Security' },
    { value: '24/7', label: 'Monitoring Services' },
    { value: '50+', label: 'Security Experts' }
  ];

  const testimonials = [
    {
      quote: "ShruuTech's security solutions have transformed our approach to cybersecurity. Their expertise is unmatched.",
      author: "Sarah Johnson",
      position: "CTO, TechGlobal Inc."
    },
    {
      quote: "After implementing ShruuTech's recommendations, we've seen a 70% reduction in security incidents.",
      author: "Michael Chen",
      position: "Security Director, DataFlow Systems"
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-dark-light to-dark dark:from-dark dark:to-dark-lighter text-white py-24 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Advanced Cybersecurity<br />for the Digital Age
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-light-dark mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Protect your digital assets with cutting-edge security solutions tailored to your needs.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link 
                to="/services" 
                className="btn btn-primary text-center"
              >
                Explore Services
              </Link>
              <Link 
                to="/contact" 
                className="btn btn-outline text-center"
              >
                Get a Consultation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-dark-light" ref={statsRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-secondary-400">{stat.value}</p>
                <p className="mt-2 text-gray-600 dark:text-light-darker">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark" ref={servicesRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-light mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Our Security Services
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-light-darker"
              initial={{ opacity: 0, y: 20 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Comprehensive cybersecurity solutions designed to protect your business at every level.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-dark-lighter rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-dark-light flex items-center justify-center mb-6">
                    <service.icon size={32} className="text-primary-600 dark:text-secondary-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-light mb-4">{service.title}</h3>
                  <p className="text-gray-600 dark:text-light-darker mb-6">{service.description}</p>
                  <Link 
                    to={service.link} 
                    className="text-primary-600 dark:text-secondary-400 font-medium hover:text-primary-700 dark:hover:text-secondary-500 flex items-center"
                  >
                    Learn more <span className="ml-1">&rarr;</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-light mb-6">Why Choose ShruuTech Security?</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiUsers className="h-6 w-6 text-primary-600 dark:text-secondary-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-light">Expert Team</h3>
                    <p className="mt-2 text-gray-600 dark:text-light-darker">Our team consists of certified security professionals with years of experience in cybersecurity.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiDatabase className="h-6 w-6 text-primary-600 dark:text-secondary-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-light">Advanced Technology</h3>
                    <p className="mt-2 text-gray-600 dark:text-light-darker">We utilize cutting-edge security technologies and methodologies to stay ahead of evolving threats.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiAward className="h-6 w-6 text-primary-600 dark:text-secondary-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-light">Proven Results</h3>
                    <p className="mt-2 text-gray-600 dark:text-light-darker">Our track record speaks for itself with a 99.9% success rate in protecting client systems.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 mt-10 lg:mt-0"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Security team at work" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark" ref={trustRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-light mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={trustInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Trusted by Industry Leaders
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-light-darker"
              initial={{ opacity: 0, y: 20 }}
              animate={trustInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              See what our clients have to say about our security services.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-dark-lighter p-8 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={trustInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div className="text-2xl text-primary-600 dark:text-secondary-400 mb-4">"</div>
                <p className="text-gray-700 dark:text-light-dark text-lg mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-dark-light flex items-center justify-center">
                    <span className="text-gray-600 dark:text-light-darker font-bold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 dark:text-light">{testimonial.author}</h4>
                    <p className="text-gray-600 dark:text-light-darker">{testimonial.position}</p>
                  </div>
                </div>
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
            Ready to Secure Your Digital Assets?
          </motion.h2>
          <motion.p 
            className="text-xl mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Contact us today for a free security consultation and take the first step toward comprehensive protection.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <Link to="/contact" className="btn bg-white text-primary-700 dark:text-dark-light hover:bg-gray-100 transition-all">
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;