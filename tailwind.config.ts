import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        paper: "#fcfbf7",
        cloud: "#f3f6fb",
        blueberry: "#3b6ff5",
        mint: "#0fa86b",
        sunshine: "#f4b63f",
        coral: "#f46f5f",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 22px 70px rgba(31, 44, 71, 0.12)",
        card: "0 16px 45px rgba(48, 58, 90, 0.14)",
      },
    },
  },
  plugins: [],
} satisfies Config;
