import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: "#1E213F",
        black: "#0A0B1A",
        cyan: "#00E5FF",
        violet: "#8A2BE2",
        gold: "#FFD700",
        white: "#FFFFFF",
        lightGray: "#D3D3D3",
        darkGray: "#4A4A4A",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
