const { fontFamily } = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--exo-font)", ...fontFamily.sans],
        serif: ["var(--exo-font)", ...fontFamily.serif],
      },
    },
  },
  plugins: [],
};
