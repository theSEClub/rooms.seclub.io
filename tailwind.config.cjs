/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#343232",
          "secondary": "#B8B8B8",
          "accent": "#343232",
          "neutral": "#272626",
          "base-100": "#000000",
          "base-300": "#B8B8B8",
          "info": "#63cecb",
          "success": "#a3e635",
          "warning": "#fde047",
          "error": "#dc2626",
          "--rounded-box": "0rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1rem",
        },
      },
      {
        white: {
          "primary": "#B8B8B8",
          "secondary": "#8854ed",
          "accent": "#B8B8B8",
          "neutral": "#EBEBEB",
          "base-100": "#FFFFFF",
          "info": "#63cecb",
          "success": "#008000",
          "warning": "#A6A659",
          "error": "#FF0000",
          "--rounded-box": "0rem", // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1rem"
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}
