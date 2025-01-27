/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primarydarkbg: "#1e232f",
        primary_light: "#49e7a5",
        primary_lighter: "#53f5aa",
        primary_dark: "#3ecb6f",
        primary_darker: "#3cbc78",
      },
    },
  },
  plugins: [],
};
