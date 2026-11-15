/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Logo Primary Color - Vibrant Magenta Pink ("URBAN")
        brand: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F43F9E',
          500: '#E6007E', // Exact logo magenta pink
          600: '#D10072',
          700: '#A8005C',
          800: '#830048',
          900: '#50002C',
          950: '#31001B',
        },
        // Logo Secondary Accent - Bright Golden Yellow ("SCENERY")
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FFB800', // Exact logo golden yellow
          600: '#E5A500',
          700: '#B28000',
          800: '#805C00',
          900: '#4D3700',
          950: '#2A1D00',
        },
        urban: {
          pink: '#E6007E',
          yellow: '#FFB800',
          dark: '#0B0F19',
          darker: '#070A12',
          cardDark: '#111827',
          borderDark: '#1F293D',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
}
