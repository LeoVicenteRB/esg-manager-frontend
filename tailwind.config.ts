import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: '#2f402c', foreground: '#ffffff' },
        accent: { DEFAULT: '#e5d3af', foreground: '#2f402c' },
        muted: '#f4f7f6',
        florence: {
          bg: '#fdfbf5',
          text: '#2f402c',
          sand: '#e5d3af',
        },
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, .08)',
        card: '0 12px 40px rgba(47, 64, 44, .08)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 700ms ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
