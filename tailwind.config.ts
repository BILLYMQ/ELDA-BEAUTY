import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "elda-purple": {
          DEFAULT: "#4B1D6B",
          light: "#6B2E94",
          dark: "#2E0F42",
        },
        "elda-gold": {
          DEFAULT: "#C9A24B",
          light: "#E4C878",
          dark: "#A47F2E",
        },
        "elda-beige": {
          DEFAULT: "#F5EEE3",
          dark: "#E9DCC6",
        },
        "elda-cream": "#FBF8F3",
        "elda-black": "#1A1420",
      },
      fontFamily: {
        display: ["Georgia", "'Playfair Display'", "serif"],
        body: ["'Segoe UI'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "elda-gradient": "linear-gradient(135deg, #2E0F42 0%, #4B1D6B 45%, #C9A24B 100%)",
        "elda-gradient-soft": "linear-gradient(135deg, #F5EEE3 0%, #FBF8F3 100%)",
      },
      boxShadow: {
        elda: "0 10px 40px -10px rgba(75, 29, 107, 0.25)",
        "elda-gold": "0 8px 30px -8px rgba(201, 162, 75, 0.45)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
