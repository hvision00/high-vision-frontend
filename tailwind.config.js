/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      spacing: {
        '1': '0.25rem',  // 4px
        '2': '0.5rem',   // 8px
        '3': '0.75rem',  // 12px
        '4': '1rem',     // 16px
        '5': '1.25rem',  // 20px
        '6': '1.5rem',   // 24px
        '8': '2rem',     // 32px
        '10': '2.5rem',  // 40px
        '12': '3rem',    // 48px
        '16': '4rem',    // 64px
        '20': '5rem',    // 80px
        '24': '6rem',    // 96px
      },
      colors: {
        brand: {
          light: '#A0C2FF',
          DEFAULT: '#3672E0',
          dark: '#2862CE',
        },
        neutral: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#2C2C2C',
          900: '#171717',
        },
        primary: {
          light: '#B1C5CE',
          DEFAULT: '#92A6B0',
          dark: '#3A505B',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
        telegraf: ['Telegraf', 'sans-serif'],
      },
      maxWidth: {
        'container': '1280px',
        'content': '768px',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Animazioni personalizzate per lo slider
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-slow': 'slide 60s linear infinite',
        'slide-normal': 'slide 30s linear infinite',
        'slide-fast': 'slide 15s linear infinite',
        'fade-in': 'fade-in 0.6s ease-out',
      },
    },
  },
  plugins: [],
}