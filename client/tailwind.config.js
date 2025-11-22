/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          600: "var(--color-primary-600)",
          400: "var(--color-primary-400)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          600: "var(--color-secondary-600)",
          300: "var(--color-secondary-300)",
        },
        accent: {
          DEFAULT: "var(--color-primary-400)",
          600: "var(--color-primary)",
        },
        neutral: {
          bg: "var(--color-bg)",
          surface: "var(--color-surface)",
          "surface-alt": "var(--color-surface-alt)",
          text: "var(--color-text)",
          "text-secondary": "var(--color-text-secondary)",
          muted: "var(--color-muted)",
          "muted-2": "var(--color-muted-2)",
          border: "var(--color-border)",
        }
      }
    },
  },
  plugins: [],
}
