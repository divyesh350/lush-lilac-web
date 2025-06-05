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
          DEFAULT: '#9F7AEA',
          light: '#FDF4FF',
          dark: '#805AD5',
        },
        secondary: {
          DEFAULT: '#FDF4FF',
          light: '#FAF5FF',
          dark: '#E9D8FD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Pacifico', 'cursive'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
        'button': '8px',
      },
    },
  },
  plugins: [],
} 