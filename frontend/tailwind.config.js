// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        alatsi: ['"Alatsi"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
