/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cabinet Grotesk'", "'DM Serif Display'", "Georgia", "serif"],
        body: ["'Satoshi'", "'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-up":   "fadeUp 0.7s ease both",
        "fade-in":   "fadeIn 0.5s ease both",
        "float":     "float 6s ease-in-out infinite",
        "scan":      "scan 2s ease-in-out infinite",
        "pulse-dot": "pulseDot 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:   { "0%": { opacity:"0", transform:"translateY(28px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        fadeIn:   { "0%": { opacity:"0" }, "100%": { opacity:"1" } },
        float:    { "0%,100%": { transform:"translateY(0px)" }, "50%": { transform:"translateY(-10px)" } },
        scan:     { "0%,100%": { transform:"translateY(0)" }, "50%": { transform:"translateY(60px)" } },
        pulseDot: { "0%,100%": { opacity:"0.4", transform:"scale(0.9)" }, "50%": { opacity:"1", transform:"scale(1.1)" } },
      },
    },
  },
  plugins: [],
};
