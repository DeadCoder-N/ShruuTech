import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiTarget, FiLifeBuoy, FiClock, FiGlobe } from 'react-icons/fi';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      position: 'Chief Executive Officer',
      bio: 'With over 20 years of experience in cybersecurity, Sarah leads our company with a vision to make advanced security accessible to all organizations.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      name: 'Michael Chen',
      position: 'Chief Technology Officer',
      bio: 'Michael brings 15 years of security engineering expertise, leading our technical teams to develop cutting-edge security solutions.',
      image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      name: 'Alex Rodriguez',
      position: 'Head of Security Operations',
      bio: 'Alex oversees our security operations center, ensuring 24/7 monitoring and response to protect our clients from evolving threats.',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      name: 'Emily Thompson',
      position: 'Director of Compliance',
      bio: 'Emily ensures our security practices meet the highest standards and comply with international regulations and industry requirements.',
      image: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-dark-light to-dark dark:from-dark dark:to-dark-lighter text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About ShruuTech Security
            </motion.h1>
            <motion.p 
              className="text-xl text-light-dark mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Pioneering the future of cybersecurity with cutting-edge solutions and expert services
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
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
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-light mb-6">Our Story</h2>
              <div className="prose prose-lg text-gray-600 dark:text-light-darker max-w-none">
                <p>
                  Founded in 2020, ShruuTech Security emerged from a vision to provide robust, accessible cybersecurity solutions in an increasingly digital world. What started as a small team of security experts has grown into a leading security consultancy trusted by organizations worldwide.
                </p>
                <p>
                  Our journey began when our founders, seasoned cybersecurity professionals, recognized a critical gap in the market: while cyber threats were growing in sophistication, many organizations lacked access to advanced security expertise and technologies.
                </p>
                <p>
                  Since then, we've built a reputation for excellence by combining cutting-edge technology with human expertise. Our approach is centered on understanding each client's unique needs and delivering tailored security solutions that provide real protection against evolving threats.
                </p>
                <p>
                  Today, ShruuTech Security stands at the forefront of cybersecurity innovation, continuously evolving our services and technologies to stay ahead of emerging threats and protect our clients' digital assets.
                </p>
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
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="ShruuTech team working together" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission and Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-light mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Our Mission & Values
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-light-darker"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              We're driven by a mission to make the digital world safer through innovative security solutions and a commitment to excellence.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiShield className="h-12 w-12 text-primary-600 dark:text-secondary-400" />,
                title: 'Security Excellence',
                description: 'We are committed to delivering the highest standard of security solutions, staying at the forefront of technological advancements and industry best practices.'
              },
              {
                icon: <FiUsers className="h-12 w-12 text-primary-600 dark:text-secondary-400" />,
                title: 'Client-Centric Approach',
                description: "We prioritize understanding our clients' unique security challenges and tailor our solutions to meet their specific needs and objectives."
              },
              {
                icon: <FiTarget className="h-12 w-12 text-primary-600 dark:text-secondary-400" />,
                title: 'Integrity & Trust',
                description: 'We operate with transparency, honesty, and ethical standards in all our interactions, building long-term relationships based on trust.'
              },
              {
                icon: <FiLifeBuoy className="h-12 w-12 text-primary-600 dark:text-secondary-400" />,
                title: 'Continuous Innovation',
                description: 'We persistently explore new technologies and methodologies to enhance our security solutions and stay ahead of emerging threats.'
              },
              {
                icon: <FiClock className="h-12 w-12 text-primary-600 dark:text-secondary-400" />,
                title: 'Proactive Protection',
                description: 'We believe in anticipating and preventing security incidents rather than just responding to them, focusing on proactive measures to safeguard our clients.'
              },
              {
                icon: <FiGlobe className="h-12 w-12 text-primary-600 dark:text-secondary-400" />,
                title: 'Global Perspective',
                description: 'We approach security with a global mindset, recognizing that threats know no boundaries and implementing solutions that provide comprehensive protection.'
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-dark-lighter p-8 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-light mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-light-darker">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-white dark:bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-light mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Our Leadership Team
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-light-darker"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Meet the experts leading our mission to transform cybersecurity
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 dark:bg-dark rounded-lg overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-light">{member.name}</h3>
                  <p className="text-primary-600 dark:text-secondary-400 mb-4">{member.position}</p>
                  <p className="text-gray-600 dark:text-light-darker">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-light mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Our Achievements
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-light-darker"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Milestones that mark our journey of excellence in cybersecurity
            </motion.p>
          </div>

          <div className="space-y-12">
            {[
              {
                year: '2025',
                title: 'Global Expansion',
                description: 'Opened new offices in Asia and Europe, extending our services to clients worldwide.',
                image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              },
              {
                year: '2024',
                title: 'Industry Recognition',
                description: 'Received the Cybersecurity Excellence Award for our innovative threat intelligence platform.',
                image: 'https://images.pexels.com/photos/3810832/pexels-photo-3810832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              },
              {
                year: '2023',
                title: 'Research Breakthrough',
                description: 'Our research team published a groundbreaking study on AI-based security solutions, cited by industry leaders.',
                image: 'https://images.pexels.com/photos/3194519/pexels-photo-3194519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              },
              {
                year: '2022',
                title: 'Strategic Partnerships',
                description: 'Formed strategic partnerships with leading technology providers to enhance our security offerings.',
                image: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              },
              {
                year: '2021',
                title: 'Client Milestone',
                description: 'Reached the milestone of protecting over 100 enterprise clients across various industries.',
                image: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              },
              {
                year: '2020',
                title: 'Company Founded',
                description: 'ShruuTech Security was founded with a mission to provide advanced security solutions to organizations of all sizes.',
                image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              }
            ].map((achievement, index) => (
              <motion.div 
                key={index}
                className="flex flex-col md:flex-row items-center gap-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className={`md:w-1/3 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src={achievement.image} 
                      alt={achievement.title} 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <div className={`md:w-2/3 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="bg-white dark:bg-dark-lighter p-8 rounded-lg shadow-md">
                    <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-dark text-primary-800 dark:text-secondary-400 rounded-full text-sm font-semibold mb-4">
                      {achievement.year}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-light mb-4">{achievement.title}</h3>
                    <p className="text-gray-600 dark:text-light-darker">{achievement.description}</p>
                  </div>
                </div>
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
            Ready to Partner with ShruuTech?
          </motion.h2>
          <motion.p 
            className="text-xl mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Join the hundreds of organizations that trust us with their cybersecurity needs. Contact us today to learn how we can help protect your digital assets.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <a href="/contact" className="btn bg-white text-primary-700 dark:text-dark-light hover:bg-gray-100 transition-all">
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;