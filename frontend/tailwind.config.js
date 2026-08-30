/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: '#F6F1E4',
        paper: '#FBF8F1',
        forest: { DEFAULT: '#2F4A3E', dark: '#1E3129', light: '#4A6B5A' },
        clay: '#C4562C',
        brown: { DEFAULT: '#6B4A34', light: '#8A6B52' },
        harbor: '#5E82A0',
        ink: '#26241D',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        stamp: '0 1px 0 rgba(38,36,29,0.05), 0 8px 24px -8px rgba(38,36,29,0.25)',
      },
    },
  },
  plugins: [],
}
