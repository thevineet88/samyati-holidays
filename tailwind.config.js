import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './template.html',
    './packages/*.json',
    './dist/**/*.html',
    './about.html',
    './contact.html',
    './packages.html',
    './package-detail.html',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#2D2E6E',
        orange: '#F47920',
        'light-gray': '#F5F6FA',
        'dark-gray': '#2C2C2C',
        muted: '#6B7280',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        kalam: ['Kalam', 'cursive'],
      },
    },
  },
  plugins: [],
};
