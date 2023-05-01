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
        seTheme: {
          "primary": "#141414",
          "secondary": "#8854ed",
          "accent": "#63cecb",
          "neutral": "#141414",
          "base-100": "#FFFFFF",
        },
      }, 
    ],
  },
  plugins: [require("daisyui")],
}
