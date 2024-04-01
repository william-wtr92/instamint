/** @type {import("tailwindcss").Config} */
import colors from "tailwindcss/colors"

module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../../packages/ui/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontSize: {
        title: ["2rem", { fontWeight: "900" }],
        heading: ["1.5rem", { fontWeight: "700" }],
        subheading: ["1.25rem", { fontWeight: "700" }],
        body: ["1rem", { fontWeight: "500" }],
        medium: ["0.8rem", { fontWeight: "500" }],
        small: ["0.6rem", { fontWeight: "400" }],
      },
      spacing: {
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
      },
      padding: {
        "text-small-screen": "1.5rem",
        "text-large-screen": "1.3rem",
        content: "0.375rem",
        border: "0.25rem",
      },
      margin: {
        default: "0.5rem",
      },
      borderWidth: {
        DEFAULT: "1px",
        "0": "0",
        "1": "1px",
        "2": "2px",
      },
      borderColor: {
        "default-border": "#B7C8BA",
        "light-border": "#b0b0b0",
        "dark-border": "#262626",
      },
      textDecorationColor: {
        default: "#B7C8BA",
        light: "#b0b0b0",
        dark: "#262626",
      },
      textDecorationThickness: {
        "1": "1px",
        "2": "2px",
      },
      textUnderlineOffset: {
        default: "2px",
      },
      keyframes: {
        shake: {
          "20%": {
            transform: "rotate(-20deg)",
          },
          "40%": {
            transform: "rotate(20deg)",
          },
          "60%": {
            transform: "rotate(-20deg)",
          },
          "80%": {
            transform: "rotate(20deg)",
          },
          "100%": {
            transform: "rotate(0deg)",
          },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
      },
    },
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      red: colors.red,
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
      variant: {
        accent: {},
      },
      error: {
        primary: "#FF0000",
      },
      success: {
        primary: "#00FF00",
      },
    },
  },
  plugins: [],
}
