/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stat: '#9e9ee2',
        main: '#39A7FF',
        secondary: '#FFEED9',
        third: '#120D6B',
        blue: '#87C4FF',
        'light-blue': '#E0F4FF',
        'logo-orange': '#FE9100',
        gray: {
          1: '#333333',
          2: '#707070',
          3: '#BDBDBD',
          4: '#D0D0D0',
          5: '#E1E1E1',
          6: '#F5F5F5',
        },
        group: {
          1: '#F08676',
          2: '#F48FB1',
          3: '#FBAA68',
          4: '#ECC369',
          5: '#A7C972',
          6: '#3E8E6E',
          7: '#7DD1C1',
          8: '#7AA5E9',
          9: '#CE93D8',
        },
      },
      fontFamily: {
        nanum: ['Nanum Gothic', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
