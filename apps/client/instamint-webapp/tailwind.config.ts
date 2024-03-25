/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors"

module.exports = {
  content: [
    "./src/web/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {},
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      red: colors.red,
      accent: {
        primary: "#16502D",
        secondary: "#37C871",
        tertiary: "#55FF99",
        quaternary: "#B3FF80",
      },
      neutral: {
        primary: "#4A504D",
        secondary: "#B7C8BA",
        tertiary: "#E0F0E4",
      },
      error: {
        primary: "#FF0000",
      },
    },
  },
  plugins: [],
}
