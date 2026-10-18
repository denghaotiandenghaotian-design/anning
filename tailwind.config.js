/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'serif'],
      },
      colors: {
        brand: {
          50: '#f0f7f2',
          100: '#dceee1',
          200: '#bbddc5',
          300: '#8fc4a0',
          400: '#62a578',
          500: '#428a5c',
          600: '#326f49',
          700: '#2a593c',
          800: '#244832',
          900: '#1f3c2a',
          950: '#0f2118',
        },
        warm: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e8dfd0',
        },
      },
    },
  },
  plugins: [],
};
