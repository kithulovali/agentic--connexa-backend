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
          50: '#FFFBEA',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#D9A514',
          500: '#946B00',
          600: '#805800',
          700: '#684700',
          800: '#513700',
          900: '#3D2900',
          950: '#241800',
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
          pink: '#946B00',
          yellow: '#FACC15',
          dark: '#171717',
          darker: '#111111',
          cardDark: '#1F1F1F',
          borderDark: '#3F3F46',
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
