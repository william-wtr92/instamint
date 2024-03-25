/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["src/**/*.{ts,tsx}", "../../packages/ui/**/*.{ts,tsx}"],
  theme: {
    extend: {},
    colors: {
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
