import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Medical-calm palette
        ink: {
          DEFAULT: "#0E1B2A",
          soft: "#33475B",
          muted: "#6B7C8F",
          faint: "#9AA8B5",
        },
        clinical: {
          50: "#EAF4F6",
          100: "#D2E9ED",
          200: "#A7D4DC",
          300: "#6FB8C5",
          400: "#3E97A8",
          500: "#1F7C8E",
          600: "#136476",
          700: "#0F5061",
          800: "#0D3F4D",
          900: "#0B313C",
        },
        // Pillar accents
        nutrition: {
          soft: "#D9F2E4",
          DEFAULT: "#2FB37E",
          deep: "#1C8F62",
        },
        physical: {
          soft: "#D6ECF6",
          DEFAULT: "#2E9BD6",
          deep: "#1A77AE",
        },
        mental: {
          soft: "#E4DEF8",
          DEFAULT: "#7C6BE0",
          deep: "#5B49C2",
        },
        // Status
        ready: {
          soft: "#DCF3E6",
          DEFAULT: "#34B97E",
          deep: "#1F9A64",
        },
        attention: {
          soft: "#FBEEDA",
          DEFAULT: "#E8A53C",
          deep: "#C9851D",
        },
        risk: {
          soft: "#FBE0DE",
          DEFAULT: "#E26A5E",
          deep: "#C84A3E",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glass:
          "0 1px 1px rgba(14,27,42,0.04), 0 8px 24px -6px rgba(14,27,42,0.10), 0 24px 48px -24px rgba(14,27,42,0.18)",
        "glass-sm":
          "0 1px 2px rgba(14,27,42,0.05), 0 4px 14px -4px rgba(14,27,42,0.12)",
        ring: "0 10px 30px -12px rgba(31,124,142,0.45)",
        device:
          "0 2px 6px rgba(14,27,42,0.10), 0 30px 60px -20px rgba(14,27,42,0.45), 0 60px 120px -40px rgba(14,27,42,0.35)",
        lift: "0 12px 32px -12px rgba(14,27,42,0.22)",
      },
      backgroundImage: {
        "app-gradient":
          "radial-gradient(1200px 800px at 15% -10%, #E7F1F4 0%, rgba(231,241,244,0) 55%), radial-gradient(1000px 700px at 110% 10%, #E9E5F8 0%, rgba(233,229,248,0) 50%), linear-gradient(180deg, #F4F7F9 0%, #EEF2F5 100%)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
