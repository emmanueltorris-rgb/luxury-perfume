/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          emerald: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22',
          },
          coral: {
            50: '#fff1ed',
            100: '#ffe1d7',
            200: '#ffbfaa',
            300: '#ff9a7e',
            400: '#ff7f62',
            500: '#ff6b4d',
            600: '#e65a44',
            700: '#bf4837',
            800: '#97372e',
            900: '#7b2b26',
          },
          peach: {
            50: '#fff4e8',
            100: '#ffe7cc',
            200: '#ffd3a3',
            300: '#ffbf7b',
            400: '#ffb05e',
            500: '#ff9f48',
            600: '#e68e42',
            700: '#bf7438',
            800: '#995c30',
            900: '#764827',
          },
          espresso: {
            50: '#f4ebe7',
            100: '#e6d8d2',
            200: '#c9b0a5',
            300: '#ac8b84',
            400: '#8e6b67',
            500: '#72544f',
            600: '#5e423c',
            700: '#4d352f',
            800: '#3f2b28',
            900: '#2b1e19',
          },
          amber: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            950: '#451a03',
          },
          gold: {
            light: '#f9e076',
            DEFAULT: '#d4af37',
            dark: '#aa8c2c',
            metallic: '#c5a028',
          },
          cream: '#faf7f2',
          charcoal: '#1a1a1a',
        }
      },
      fontFamily: {
        serif: [
          'Playfair Display',
          'Cinzel',
          'Bodoni Moda',
          'Georgia',
          'serif'
        ],
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif'
        ],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'liquid-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'emerald-gold-gradient': 'linear-gradient(135deg, #064e3b 0%, #047857 25%, #d4af37 75%, #f59e0b 100%)',
        'amber-glow': 'radial-gradient(ellipse at center, rgba(245,158,11,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
