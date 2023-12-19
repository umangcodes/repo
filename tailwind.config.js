/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00ABF4",
        secondary: "#15243F",
        background: "#FBFAFC",
        disabled: '#E8E8E8',
        secondaryShade: "#737c8c"
      },
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      },
      fontSize:{
        "min": "10px"
      },
      boxShadow:{
        'special': '0 1px 2px 0 rgba(0, 171, 244, 0.1), 0 1px 2px 0 rgba(0, 171, 244, 0.2)'
      }
      // backgroundImage:{
      //   'checkmark': "url('/src/assets/images/checkmark.gif')"
      // }
    },
  },
  plugins: [],
}