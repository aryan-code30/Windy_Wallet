import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Sora", "sans-serif"],
      },
      colors: {
        primary: { DEFAULT: "#2563EB", light: "#EFF6FF", mid: "#BFDBFE" },
        accent:  { DEFAULT: "#7C3AED", light: "#F5F3FF" },
      },
      boxShadow: {
        card: "0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        hover: "0 12px 40px rgba(37,99,235,0.10), 0 4px 12px rgba(0,0,0,0.06)",
        btn:   "0 4px 14px rgba(37,99,235,0.35)",
        accentbtn: "0 4px 14px rgba(124,58,237,0.30)",
      },
    },
  },
  plugins: [],
};
export default config;
