// tailwind.config.js
module.exports = {
  darkMode: "class", // ← Enable class-based dark mode
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: "#1e293b",
        secondary: "#3B82F6",
        success: "#10B981",
        gradientFrom: "#3B82F6",
        gradientTo: "#10B981",
        background: "#F8FAFC",
        light: "#F1F5F9",
        cta: "#F97316",
      },
    },
  },
  plugins: [],
};
