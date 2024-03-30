const withMT = require("@material-tailwind/react/utils/withMT");
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = withMT( {
  content: ["./src/**/*.{js,jsx,ts,tsx,html,htm}"],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.slate,
        green: colors.emerald,
        purple: colors.violet,
        yellow: colors.amber,
        pink: colors.fuchsia,
        slate: colors.slate,
        violet: colors.violet,
        Neutral: colors.neutral,
      },
      screens: {
        "2xl": "1736px",
      },
    },
  },
  plugins: [],
  variants:{
    extend: {
      display:["focus-group"],
      display: ["group-hover"],
    },
  },
  darkMode: "class",
});