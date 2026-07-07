const defaultTheme = require("tailwindcss/defaultTheme")

// CSS 변수(oklch) 색상에 투명도 유틸리티(bg-primary/90 등)를 적용할 수 있도록
// CSS 상대 색상 문법(relative color syntax)을 사용합니다.
const withAlpha = (variable) => `oklch(from var(${variable}) l c h / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. content 경로를 JavaScript 프로젝트에 맞게 수정
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
	],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1.5rem", // 사용자 설정을 유지합니다
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // border/input은 다크 모드에서 자체 알파값을 가지므로 그대로 사용
        border: "var(--border)",
        input: "var(--input)",
        ring: withAlpha("--ring"),
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: withAlpha("--primary"),
        "primary-foreground": withAlpha("--primary-foreground"),
        secondary: withAlpha("--secondary"),
        "secondary-foreground": "var(--secondary-foreground)",
        destructive: withAlpha("--destructive"),
        accent: withAlpha("--accent"),
        "accent-foreground": "var(--accent-foreground)",
        muted: withAlpha("--muted"),
        "muted-foreground": "var(--muted-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        sidebar: "var(--sidebar)",
        "sidebar-foreground": "var(--sidebar-foreground)",
        "sidebar-primary": "var(--sidebar-primary)",
        "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
        "sidebar-accent": "var(--sidebar-accent)",
        "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
        "sidebar-border": "var(--sidebar-border)",
        "sidebar-ring": "var(--sidebar-ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
      },
      boxShadow: { // 사용자 설정을 유지합니다
        xs: "0 1px 2px 0 rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      // ⬇️ [추가됨] shadcn/ui 애니메이션
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
  // ⬇️ [수정됨] shadcn/ui 애니메이션 플러그인 (필수)
  plugins: [require("tailwindcss-animate")], 
}

