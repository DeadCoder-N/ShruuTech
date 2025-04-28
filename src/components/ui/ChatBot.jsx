import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: 'Hello! I\'m ShruuTech\'s Security Assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto responses based on keywords
  const responses = {
    hello: "Hi there! How can I assist you with your security needs today?",
    services: "We offer Network Security, Data Protection, and Threat Intelligence services. Would you like to know more about any of these?",
    course: "Our cybersecurity courses cover various specializations with flexible schedules. Check our Courses page for more details!",
    price: "Our pricing varies based on your specific needs. Would you like a consultation to discuss a custom solution?",
    contact: "You can reach our team at contact@shruutech.com or call us at +1 (555) 123-4567.",
    help: "I'd be happy to help! Ask me about our services, courses, or how to get in touch with our team."
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      let botResponse = "I'm not sure how to help with that. Would you like to speak with one of our security specialists?";
      
      // Check for keywords in the input
      const lowercaseInput = inputValue.toLowerCase();
      for (const [keyword, response] of Object.entries(responses)) {
        if (lowercaseInput.includes(keyword)) {
          botResponse = response;
          break;
        }
      }

      const botMessage = {
        type: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-primary-600 dark:bg-secondary-500 text-white p-4 rounded-full shadow-lg z-40"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle chat"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white dark:bg-dark-lighter rounded-lg shadow-xl z-40 overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Chat header */}
            <div className="bg-primary-600 dark:bg-secondary-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiMessageSquare size={20} />
                <h3 className="font-medium">Security Assistant</h3>
              </div>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close chat"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto max-h-80">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary-100 dark:bg-dark-light text-gray-800 dark:text-light'
                        : 'bg-gray-100 dark:bg-dark-light text-gray-800 dark:text-light'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-right">
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 dark:border-gray-700 dark:bg-dark-light dark:text-light rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-secondary-400"
                />
                <button
                  type="submit"
                  className="bg-primary-600 dark:bg-secondary-600 text-white p-2 rounded-r-md hover:bg-primary-700 dark:hover:bg-secondary-700 transition-colors"
                  aria-label="Send message"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;