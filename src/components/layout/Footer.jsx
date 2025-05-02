import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedinIn, FaGithub, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Logo from '../ui/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-dark-lighter pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo className="h-10 w-auto" />
            <p className="text-gray-600 dark:text-light-darker mt-2 max-w-xs">
              Your trusted partner in advanced cybersecurity solutions, providing cutting-edge protection for your digital assets.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={20} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-light">Quick Links</h3>
            <nav className="space-y-3">
              <Link to="/" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Home
              </Link>
              <Link to="/services" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Services
              </Link>
              <Link to="/courses" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Courses
              </Link>
              <Link to="/blog" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Blog
              </Link>
              <Link to="/careers" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Careers
              </Link>
              <Link to="/about" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                About
              </Link>
              <Link to="/login" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Admin
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-light">Services</h3>
            <nav className="space-y-3">
              <Link to="/services" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Network Security
              </Link>
              <Link to="/services" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Data Protection
              </Link>
              <Link to="/services" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Threat Intelligence
              </Link>
              <Link to="/services" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Security Audits
              </Link>
              <Link to="/services" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Penetration Testing
              </Link>
              <Link to="/services" className="block text-gray-600 hover:text-primary-600 dark:text-light-darker dark:hover:text-secondary-400 transition-colors">
                Security Training
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-light">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 text-primary-600 dark:text-secondary-400" />
                <span className="text-gray-600 dark:text-light-darker">
                  123 Cyber Street, Tech City, TC 10101
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-primary-600 dark:text-secondary-400" />
                <span className="text-gray-600 dark:text-light-darker">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-600 dark:text-secondary-400" />
                <span className="text-gray-600 dark:text-light-darker">contact@shruutech.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-600 dark:text-light-darker text-sm">
            &copy; {currentYear} Dead Coder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
