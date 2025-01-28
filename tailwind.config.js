/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primarydarkbg: "#1e232f",
        primary_one: "#00bfff",
      },
    },
  },
  plugins: [],
};
