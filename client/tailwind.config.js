/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1035',
        indigo: {
          DEFAULT: '#1B2166',
          950: '#0B1035',
          900: '#141B4D',
          800: '#1B2166',
          700: '#262E82',
        },
        mint: {
          DEFAULT: '#17D9A3',
          400: '#3EE6B5',
          500: '#17D9A3',
          600: '#0FB88A',
        },
        sand: '#F6F5F1',
        coral: '#FF6B57',
        amber: '#FFB020',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 20px 40px -20px rgba(11, 16, 53, 0.35)',
        soft: '0 8px 24px -8px rgba(11, 16, 53, 0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
