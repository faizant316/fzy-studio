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
        ink:        "#0a0a0a",
        cream:      "#f5f0eb",
        gold:       "#c9a96a",
        "gold-soft": "#d8c29a",
        "border-dark": "#1c1c1c",
        muted:      "#8a8580",
      },
      fontFamily: {
        sans:    ["var(--font-inter)"],
        display: ["var(--font-syne)"],
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
