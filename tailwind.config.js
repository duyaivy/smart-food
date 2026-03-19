const {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
} = require('./src/constants/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontFamily,
      fontSize,
      lineHeight,
      fontWeight,
    },
  },
  plugins: [],
};
