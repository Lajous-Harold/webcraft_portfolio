/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          peachPink: "#FAD0C9",
          peachLight: "#FAD6A5",
          coral: "#FFABAB",
          apricot: "#FFC3A0",
          lavender: "#D5AAFF",
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,.08)",
      },
    },
  },
  plugins: [],
};
