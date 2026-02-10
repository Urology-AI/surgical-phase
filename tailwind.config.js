/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#06ABEB', // Mount Sinai Vivid Cerulean
          600: '#0599d4',
          700: '#0480b3',
          800: '#036892',
          900: '#025071',
        },
        sinai: {
          cerulean: '#06ABEB', // Vivid Cerulean
          blue: '#212070', // St. Patrick's Blue
          dark: '#00002D', // Cetacean Blue
          pink: '#DC298D', // Barbie Pink
          gold: '#FFC72C', // Mount Sinai Gold
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
