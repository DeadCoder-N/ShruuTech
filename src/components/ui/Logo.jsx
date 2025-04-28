import { useTheme } from '../../contexts/ThemeContext';

const Logo = ({ className = 'h-8 w-auto' }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`${className} flex items-center`}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full">
        <path 
          d="M12 2L2 7L12 12L22 7L12 2Z" 
          fill={darkMode ? '#64ffda' : '#00a1e6'} 
        />
        <path 
          d="M2 17L12 22L22 17" 
          stroke={darkMode ? '#64ffda' : '#00a1e6'} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M2 12L12 17L22 12" 
          stroke={darkMode ? '#64ffda' : '#00a1e6'} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
      <span className="ml-2 text-lg font-bold text-gray-900 dark:text-light">ShruuTech</span>
    </div>
  );
};

export default Logo;