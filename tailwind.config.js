
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#2B8C44',
          600: '#1F6A33',
          400: '#7EBF8D',
        },
        earth: {
          500: '#8B5A2B',
          400: '#C19A6B',
        },
        accent: {
          500: '#D4A017',
          400: '#F4D03F',
        }
      },
    },
  },
  plugins: [],
}