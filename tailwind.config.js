/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./src/**/*.{html,js}"],
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  theme: {
    extend: {
      colors: {
          tossBlue: "#0064FF",
          tossGray: "#202632",
      },
  },
},
  plugins: [],
};

