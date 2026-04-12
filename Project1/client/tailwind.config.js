/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#63D471",
        secondary: "#ffffff",
        dark: "#000000"
      }
    },
  },
  plugins: [],
}

