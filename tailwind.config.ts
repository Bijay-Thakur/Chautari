import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#1a0a00",
        amber: {
          custom: "#d97706",
        },
        cream: "#fdf6ec",
        forest: "#0d2b1a",
        "chain-iron": "#4a5568",
        "chain-gold": "#f6c90e",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        nepali: ["var(--font-nepali)", "Noto Sans Devanagari", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
