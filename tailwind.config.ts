import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
      fontFamily: {
        'reem-kufi-fun': ['var(--font-reem-kufi-fun)', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
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
        mintDark: {
          DEFAULT: "hsl(var(--mint-dark))",
        },
        mintMedium: {
          DEFAULT: "hsl(var(--mint-medium))",
        },
        mintDeep: {
          DEFAULT: "hsl(var(--mint-deep))",
        },
        peachLight: {
          DEFAULT: "hsl(var(--peach-light))",
        },
        mintBackground: {
          DEFAULT: "hsl(var(--mint-background))",
          foreground: "hsl(var(--mint-background-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          light: "hsl(var(--success-light))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          light: "hsl(var(--danger-light))",
        },

        // Existing custom colors
        "primary-blue": "#5D9CEC",
        "light-peach": "#FFF0E6",
        "medium-peach": "#FFD1B3",
        "dark-mint": "#4DB380",
        "deep-mint": "#317A52",
        "pale-mint": "#E6F7EB",

        // ✅ Added gradient colors
        deep: {
          orchid: "#A66894",
        },
        terracotta: {
          brown: "#733A31",
        },
        roseLight: {
          DEFAULT: "##00000099",
        },
        roseDark: {
          DEFAULT: "#C895B8",
        },
        roseMedium: {
          DEFAULT: "#E3A6A6",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
