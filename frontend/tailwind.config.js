/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FAFAF8',
        surface: '#FFFFFF',
        border: {
          DEFAULT: '#E8E6E1',
          strong: '#D6D3CB',
        },
        ink: {
          DEFAULT: '#1A1A18',
          soft: '#6B6963',
          faint: '#9C9A93',
        },
        accent: {
          DEFAULT: '#3D5A80',
          soft: '#EAF0F6',
          strong: '#2C4260',
        },
        priority: {
          high: '#C1443C',
          highSoft: '#FBEBEA',
          medium: '#B8860B',
          mediumSoft: '#FBF3E1',
          low: '#4A7C59',
          lowSoft: '#EBF3ED',
        },
        status: {
          pending: '#6B6963',
          pendingSoft: '#F0EFEC',
          progress: '#3D5A80',
          progressSoft: '#EAF0F6',
          done: '#4A7C59',
          doneSoft: '#EBF3ED',
          overdue: '#C1443C',
          overdueSoft: '#FBEBEA',
        },
      },
      fontFamily: {
        display: ['"Manrope"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(26, 26, 24, 0.04), 0 1px 1px rgba(26, 26, 24, 0.03)',
        card: '0 1px 3px rgba(26, 26, 24, 0.06), 0 4px 12px rgba(26, 26, 24, 0.04)',
        popover: '0 8px 24px rgba(26, 26, 24, 0.12)',
      },
      borderRadius: {
        md: '8px',
        lg: '10px',
        xl: '14px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
