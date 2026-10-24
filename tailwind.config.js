/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#DD3244',
          'primary-dark': '#C12036',
          'primary-light': '#FAEAEC',
          secondary: '#EF8044',
          'secondary-dark': '#D4663A',
          'secondary-light': '#FEF0E8',
          dark: '#383737',
          gray: '#B2B7C5',
          'gray-light': '#D0D0D0',
          accent: '#A4D2D5',
          'accent-light': '#E8F5F5',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
};
