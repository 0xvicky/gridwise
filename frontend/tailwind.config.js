/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F9FA',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        primary: {
          DEFAULT: '#155959',
          dark: '#124B4B',
          light: '#E8F1F1',
        },
        accent: {
          DEFAULT: '#F38D26',
          dark: '#E67F16',
          light: '#FFF3E8',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        critical: '#DC2626',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['3rem', { lineHeight: '1.05', letterSpacing: '0', fontWeight: '800' }],
        'section-title': ['1.5rem', { lineHeight: '1.25', letterSpacing: '0', fontWeight: '700' }],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 10px 30px rgba(31, 41, 55, 0.04), 0 1px 2px rgba(31, 41, 55, 0.04)',
        'card-hover': '0 18px 45px rgba(31, 41, 55, 0.08), 0 4px 10px rgba(21, 89, 89, 0.06)',
        subtle: '0 8px 20px rgba(243, 141, 38, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'counter': 'counter 1.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
