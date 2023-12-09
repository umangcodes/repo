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
        disabled: '#E8E8E8'
      },
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      },
      fontSize:{
        "min": "10px"
      },
      // backgroundImage:{
      //   'checkmark': "url('/src/assets/images/checkmark.gif')"
      // }
    },
  },
  plugins: [],
}