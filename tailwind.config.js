/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sansation: ["Sansation", "sans-serif"],
        sans: ["Sansation", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#F5C01B",
          light: "#F7D16F",
          dark: "#F39925",
        },
        secondary: {
          DEFAULT: "#48ACBD",
          light: "#9DD4E1",
        },
        grey: {
          DEFAULT: "#666666",
          light: "#E6E6E6", // Computed from lighten($grey-color, 40%)
          dark: "#262626", // Computed from darken($grey-color, 25%)
        },
        text: "#333",
      },
      spacing: {
        navbar: "3.5rem", // $navbar-height
        "side-menu": "256px", // $side-menu-width
        content: "900px", // $content-width
      },
      screens: {
        palm: { max: "600px" }, // $on-palm
        laptop: { max: "900px" }, // $on-laptop
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
