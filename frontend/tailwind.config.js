export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: 'oklch(96.54% 0.016 274.87)',
          100: 'oklch(92.45% 0.036 273.72)',
          200: 'oklch(83.9% 0.079 271.26)',
          300: 'oklch(75.27% 0.126 268.33)',
          400: 'oklch(67.04% 0.174 263.27)',
          500: 'oklch(57.48% 0.208 257.51)',
          600: 'oklch(48.74% 0.177 257.6)',
          700: 'oklch(40.2% 0.145 257.39)',
          800: 'oklch(31.35% 0.114 257.49)',
          900: 'oklch(22.64% 0.082 257.37)',
          950: 'oklch(17.96% 0.064 257.25)',
        }
      },
      fontFamily: {
        alatsi: ['"Alatsi"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
