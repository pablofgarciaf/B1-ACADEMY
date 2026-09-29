import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sap: {
          blue: "#0a6ed1",
          darkblue: "#003b75",
          navy: "#0d1b2a",
          gold: "#f59e0b",
          goldhover: "#d97706",
          dark: "#0b1320",
          card: "rgba(255, 255, 255, 0.04)",
          border: "rgba(255, 255, 255, 0.08)",
          // Fiori & CCO specific colors
          'fiori-bg': "#f2f4f7",
          'fiori-header': "#354a5f",
          'fiori-blue': "#008FD3",
          'fiori-lightblue': "#e5f0fa",
          'fiori-text': "#32363a",
          'fiori-border': "#d9d9d9",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
