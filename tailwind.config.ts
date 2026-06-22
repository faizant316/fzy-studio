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
        bg:        "#0a0a0b",
        "bg-warm": "#0f0f11",
        ink:       "#f4f4f2",
        "ink-soft": "#c7c7c5",
        gray:      "#8d8d8c",
        line:      "rgba(255,255,255,0.10)",
        accent:    "#7aa2e3",
        "accent-red": "#e0786c",
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
