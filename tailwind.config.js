/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",
        ocean: "#0f766e",
        mint: "#ccfbf1",
        coral: "#f97363",
        amber: "#f59e0b",
        paper: "#f8fafc",
        line: "#d9e2ec"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(20, 33, 61, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
