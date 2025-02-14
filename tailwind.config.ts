import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@mxmweb/difychat/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        //默认手机端
        md: "768px", // 平板竖屏 (如 iPad Mini)
        lg: "1024px", // 平板横屏/小笔记本 (如 iPad Pro)
        xl: "1536px"
      },
      container: {
        center: true, // 自动水平居中
        padding: {
          // 不同断点下的水平内边距
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem"
        },
        screens: {
          // 容器在不同断点下的最大宽度
          md: "720px", // 平板竖屏稍微收一点
          lg: "984px", // 笔记本稍微收一点
          xl: "1440px" // 桌面稍微收一点
        }
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        sidebar: "0px 0px 8px 6px #E7E8EB33"
      },
      fontSize: {
        llg: "20px"
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")]
} satisfies Config;
