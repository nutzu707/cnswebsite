import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Hero palette — remaps existing indigo/gray utilities site-wide
        indigo: {
          ...colors.indigo,
          50: "#F2F2F7",
          100: "#E4E5EF",
          200: "#C9CBDC",
          300: "#A8ABC4",
          400: "#7E82A8",
          500: "#5B5F8C",
          600: "#45497A",
          700: "#3A3D6E",
          800: "#333560",
          900: "#2E3171",
          950: "#23254F",
        },
        gray: {
          ...colors.gray,
          50: "#FAF7F3",
          100: "#F3EDE6",
          200: "#E5DDD4",
          300: "#D4C8BC",
          400: "#B5A598",
          500: "#958679",
          600: "#6B635C",
          700: "#4A443E",
          800: "#2F2B27",
          900: "#1C1917",
          950: "#12100E",
        },
        brand: {
          cream: "#F7F3EE",
          navy: "#2E3171",
          "navy-dark": "#23254F",
          sepia: "#8B6D67",
          paper: "#FFFCFA",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        growFromCenter: {
          '0%': { width: '0%', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { width: '100%', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        flipIn: {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0)', opacity: '1' },
        },


      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeUp: 'fadeUp 0.6s ease-out',
        growFromCenter: 'growFromCenter 2.8s ease-in-out forwards',
        fadeInUp: 'fadeInUp 1s ease-out forwards',
        fadeIn: 'fadeIn 0.5s ease-in-out forwards',
        flipIn: 'flipIn 0s ease-out forwards',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
