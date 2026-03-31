import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-body)"],
        heading: ["var(--font-heading)"]
      },
      colors: {
        ocean: {
          50: "#eef8ff",
          100: "#d9efff",
          200: "#b6dfff",
          300: "#7fc8ff",
          500: "#1a78b8",
          700: "#0f4f7c"
        },
        ember: {
          400: "#fb923c",
          500: "#f97316"
        }
      },
      boxShadow: {
        soft: "0 20px 45px -24px rgba(15, 23, 42, 0.4)"
      }
    }
  },
  plugins: []
};

export default config;
