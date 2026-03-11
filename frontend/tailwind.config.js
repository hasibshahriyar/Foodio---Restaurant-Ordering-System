/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef5f3',
          100: '#cde0da',
          200: '#9dc1b8',
          300: '#6da296',
          400: '#3d8374',
          500: '#1A3C34',
          600: '#153029',
          700: '#10261f',
          800: '#0b1c15',
          900: '#06110a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
};
