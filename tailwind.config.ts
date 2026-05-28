import type { Config } from 'tailwindcss';
const config: Config = { darkMode:['class'], content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./lib/**/*.{ts,tsx}'], theme:{extend:{colors:{border:'hsl(var(--border))',background:'hsl(var(--background))',foreground:'hsl(var(--foreground))',primary:{DEFAULT:'#134e4a',foreground:'#ffffff'},accent:{DEFAULT:'#0f766e',foreground:'#ffffff'},muted:'#f4f7f6'},boxShadow:{soft:'0 18px 50px rgba(15, 23, 42, .08)'}}}, plugins:[] };
export default config;
