/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "0%": "translateX(-100%)",
          "100%": "translateX(0)",
        },
        slideOut: {
          "0%": "translateX(0)",
          "100%": "translateX(-100%)",
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease-in-out",
        slideOut: "slideOut 0.5s ease-in-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
    colors: {
      accent: {
        "50": "#f0fdf4",
        "100": "#ddfbe7",
        "200": "#bdf5d1",
        "300": "#8aebad",
        "400": "#4fd981",
        "500": "#28bf60",
        "600": "#1b9e4b",
        "700": "#197c3e",
        "800": "#196235",
        "900": "#16502d",
        "950": "#062d16",
      },
      neutral: {
        "50": "#f6f6f6",
        "100": "#e7e7e7",
        "200": "#d1d1d1",
        "300": "#b0b0b0",
        "400": "#888888",
        "500": "#6d6d6d",
        "600": "#5d5d5d",
        "700": "#4f4f4f",
        "800": "#424242",
        "900": "#3d3d3d",
        "950": "#262626",
      },
      error: {
        primary: "#FF0000",
      },
      success: {
        primary: "#16502d",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
