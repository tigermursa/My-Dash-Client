/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primarydarkbg: "#1e232f",
        light_green: "#49e7a5",
        lighter_green: "#53f5aa",
        dark_green: "#3ecb6f",
        darker_green: "#3cbc78",
      },
    },
  },
  plugins: [],
};
