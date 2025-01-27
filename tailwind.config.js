/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primarydarkbg: "#1e232f",
        primary_light: "#00bfff",
        primary_lighter: "#00bfff",
        primary_dark: "#00bfff",
        primary_darker: "#00bfff",
      },
    },
  },
  plugins: [],
};
