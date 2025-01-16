/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  // eslint-disable-next-line
  plugins: [require('@tailwindcss/forms')],
};
