import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070A12",
        space: {
          DEFAULT: "#0B0F1A",
          800: "#0E1421",
          700: "#111726",
          600: "#161E30",
        },
        star: {
          DEFAULT: "#E6EAF4",
          dim: "#9AA6BF",
          faint: "#5C6880",
        },
        accent: {
          DEFAULT: "#6366F1",
          soft: "#A5B4FC",
          deep: "#3F3FBF",
        },
        signal: "#F2C879",
      },
      fontFamily: {
        serif: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Book Antiqua",
          "Songti SC",
          "STSong",
          "SimSun",
          "serif",
        ],
        sans: [
          "Inter",
          "Segoe UI",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SFMono-Regular",
          "Cascadia Code",
          "Consolas",
          "monospace",
        ],
      },
      letterSpacing: {
        widest: "0.22em",
      },
      boxShadow: {
        halo: "0 0 0 1px rgba(99, 102, 241, 0.25), 0 24px 80px -32px rgba(99, 102, 241, 0.45)",
        panel: "0 32px 80px -48px rgba(0, 0, 0, 0.9)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(148, 163, 184, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.06) 1px, transparent 1px)",
        "accent-line":
          "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.7), transparent)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw-line": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "draw-line": "draw-line 1.1s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-dot": "pulse-dot 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
