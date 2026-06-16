import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:        "#0c0a09",
        cream:      "#f5f0e8",
        gold:       "#c9a66b",
        "gold-soft": "#e2cb98",
        "gold-deep": "#a87e3c",
        "border-dark": "#1c1c1c",
        muted:      "#8c857c",
      },
      fontFamily: {
        sans:    ["var(--font-inter)"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        mono:    ["var(--font-jetbrains-mono)"],
      },
      fontSize: {
        hero: "clamp(56px, 9vw, 150px)",
      },
    },
  },
  plugins: [],
};
export default config;
