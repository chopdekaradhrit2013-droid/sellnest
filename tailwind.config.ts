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
        background: "#FBFBFA",
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F7F7F6",
          muted: "#F0F0EE",
        },
        charcoal: {
          50: "#F8F8FA",
          100: "#EFEFF1",
          200: "#D8D8DF",
          300: "#B6B6C2",
          400: "#8A8AA0",
          500: "#65657E",
          600: "#4D4D63",
          700: "#363647",
          800: "#22222E",
          900: "#14141C",
          950: "#0C0C12",
        },
        nest: {
          50: "#FAF7FF",
          100: "#F3EDFF",
          200: "#E6D7FE",
          300: "#D3B9FE",
          400: "#B88FFC",
          500: "#9E66F7",
          600: "#823FF1",
          700: "#6B21A8",
          800: "#581C87",
          900: "#3B0764",
          950: "#230341",
        },
        emeraldAccent: {
          50: "#ECFDF5",
          500: "#10B981",
          600: "#059669",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#128C7E",
          light: "#DCF8C6",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Plus Jakarta Sans"',
          '"Inter"',
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        serif: ['"Playfair Display"', "Georgia", "serif"],
        display: ['"Space Grotesk"', "sans-serif"],
        playful: ['"Outfit"', '"Plus Jakarta Sans"', "sans-serif"],
      },
      boxShadow: {
        "subtle": "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        "card": "0 2px 8px -2px rgba(16, 24, 40, 0.04), 0 1px 3px -1px rgba(16, 24, 40, 0.02)",
        "card-hover": "0 12px 32px -8px rgba(16, 24, 40, 0.08), 0 4px 12px -2px rgba(16, 24, 40, 0.04)",
        "purple-glow": "0 8px 30px -4px rgba(130, 63, 241, 0.2)",
        "purple-glow-lg": "0 20px 50px -10px rgba(130, 63, 241, 0.25)",
        "inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.8)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

