/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E6C777',
          dark: '#B8860B',
        },
        black: {
          DEFAULT: '#000000',
          soft: '#121212',
          lighter: '#1E1E1E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Optional: add Inter from Google Fonts
      },
    },
  },
  plugins: [],
}
