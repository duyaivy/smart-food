const colors = {
  black: '#000000',
  white: '#FFFFFF',

  neutral: {
    900: '#000000',
    800: '#232323',
    700: '#373737',
    600: '#4B4B4B',
    500: '#969696',
    400: '#AFAFAF',
    300: '#C8C8C8',
    200: '#E1E1E1',
    100: '#F7F7F7',
    50: '#FAFAFA',
  },
  primary: {
    700: '#E96A46',
    600: '#F47551',
    500: '#F68F72',
    400: '#F9AE99',
    300: '#FBC9BC',
    200: '#FDE3DC',
    100: '#FEF1ED',
    50: '#FFF8F6',
    DEFAULT: '#F47551',
  },

  secondary: {
    700: '#4FA857',
    600: '#67BD6E',
    500: '#82CB88',
    400: '#A3DAA8',
    300: '#C3E8C6',
    200: '#E1F5E3',
    100: '#F0FAF1',
    50: '#F8FDF8',
    DEFAULT: '#67BD6E',
  },
  danger: {
    700: '#EC2D30',
    600: '#F64C4C',
    500: '#EB6F70',
    400: '#F49898',
    300: '#FFCCD2',
    200: '#FFEBEE',
    100: '#FEF2F2',
    50: '#FFFBFB',
    DEFAULT: '#EC2D30',
  },

  warning: {
    700: '#FE9B0E',
    600: '#FFAD0D',
    500: '#FFC62B',
    400: '#FFDD82',
    300: '#FFEAB3',
    200: '#FFF7E1',
    100: '#FFF9EE',
    50: '#FFFDFA',
    DEFAULT: '#FE9B0E',
  },

  info: {
    700: '#3A70E2',
    600: '#3B82F6',
    500: '#4BA1FF',
    400: '#93C8FF',
    300: '#BDDDFF',
    200: '#E4F2FF',
    100: '#F1F8FF',
    50: '#F8FCFF',
    DEFAULT: '#3B82F6',
  },

  background: '#f9f9f9',
  foreground: '#333333',
  border: '#E1E1E1',

  config: {
    light: '#F8FEDA',
    coral: '#F47551',
    lavender: '#CCB1F6',
    text: '#333333',
    green: '#CDE26D',
    orange: '#FF5722',
    carbs: '#F8D558',
  },
};

const fontFamily = {
  // Keep the existing `font-inter` utility, but point it to Be Vietnam Pro.
  inter: ['BeVietnamPro-Regular'],
};

const fontSize = {
  // Headings
  h1: ['28px', { lineHeight: '36px', fontWeight: '700' }],
  h2: ['22px', { lineHeight: '30px', fontWeight: '700' }],
  h3: ['18px', { lineHeight: '26px', fontWeight: '700' }],
  h4: ['16px', { lineHeight: '24px', fontWeight: '700' }],
  h5: ['16px', { lineHeight: '24px', fontWeight: '600' }],

  // Special text styles
  sectionHeader: ['20px', { lineHeight: '24px', fontWeight: '600' }],
  label: ['12px', { lineHeight: '16px', fontWeight: '500' }],
  caption: ['12px', { lineHeight: '16px', fontWeight: '400' }],
  overline: [
    '10px',
    { lineHeight: '14px', fontWeight: '500', letterSpacing: '0.4px' },
  ],

  // Body
  'body-l': ['16px', { lineHeight: '24px', fontWeight: '400' }],
  'body-m': ['14px', { lineHeight: '22px', fontWeight: '400' }],
  'body-s': ['12px', { lineHeight: '20px', fontWeight: '400' }],

  // Button
  'button-l': ['16px', { lineHeight: '24px', fontWeight: '600' }],
  'button-m': ['14px', { lineHeight: '20px', fontWeight: '600' }],
};

const lineHeight = {
  14: '14px',
  16: '16px',
  20: '20px',
  22: '22px',
  24: '24px',
  26: '26px',
  30: '30px',
  36: '36px',
};

const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

module.exports = {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
};
