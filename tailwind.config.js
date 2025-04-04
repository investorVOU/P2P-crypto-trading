module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF5FF',
          100: '#E1EFFE',
          200: '#C3DDFD',
          300: '#A4CAFE',
          400: '#76A9FA',
          500: '#3F83F8',
          600: '#1C64F2',
          700: '#1A56DB',
          800: '#1E429F',
          900: '#233876',
        },
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
      },
      spacing: {
        '2/3': '66.666667%',
        '3/4': '75%',
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        '3/5': '60%',
      },
    },
  },
  plugins: [],
  // We'll be using `tailwind-rn` which needs access to these styles
  // The typical React Native approach is to use this config to generate a styles.json
  corePlugins: {
    preflight: false,
  },
};
