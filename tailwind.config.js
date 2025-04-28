/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f8ff',
          100: '#b3e7ff',
          200: '#80d6ff',
          300: '#4dc4ff',
          400: '#1ab3ff',
          500: '#00a1e6',
          600: '#007db3',
          700: '#005980',
          800: '#00344d',
          900: '#001019',
        },
        secondary: {
          50: '#e6fffa',
          100: '#b3fff0',
          200: '#80ffe7',
          300: '#4dffdd',
          400: '#1affd4',
          500: '#00e6bb',
          600: '#00b392',
          700: '#008068',
          800: '#004d3f',
          900: '#001a15',
        },
        dark: {
          lighter: '#112240',
          light: '#0a192f',
          DEFAULT: '#020c1b',
        },
        light: {
          DEFAULT: '#e6f1ff',
          dark: '#ccd6f6',
          darker: '#8892b0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        xs: '480px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}