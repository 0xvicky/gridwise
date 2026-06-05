/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark minimalist palette
        dark: {
          900: '#0a0e27', // Deep navy background
          800: '#0f1535', // Darker navy
          700: '#151c3a', // Card backgrounds
          600: '#1a2347', // Hover states
          500: '#202d4a', // Borders
        },
        // Tech/Drone accent colors
        accent: {
          cyan: '#00d9ff',
          blue: '#0088ff',
          purple: '#8b5cf6',
          green: '#10b981',
          amber: '#f59e0b',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#082f49',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      backgroundColor: {
        base: '#0a0e27',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0a0e27 0%, #151c3a 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00d9ff 0%, #0088ff 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(0, 217, 255, 0.05) 0%, rgba(0, 136, 255, 0.05) 100%)',
        'gradient-glow': 'radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%)',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideUp: 'slideUp 0.5s ease-out',
        // Drone-inspired animations
        float: 'float 6s ease-in-out infinite',
        orbit: 'orbit 8s linear infinite',
        scan: 'scan 3s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite',
        drift: 'drift 5s ease-in-out infinite',
        hover: 'hover 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Drone-inspired keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(8px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(8px) rotate(-360deg)' },
        },
        scan: {
          '0%, 100%': { transform: 'scaleX(0.8)', opacity: '0.3' },
          '50%': { transform: 'scaleX(1)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 217, 255, 0.3), inset 0 0 5px rgba(0, 217, 255, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.6), inset 0 0 10px rgba(0, 217, 255, 0.2)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(8px) translateY(-4px)' },
          '50%': { transform: 'translateX(0px) translateY(-8px)' },
          '75%': { transform: 'translateX(-8px) translateY(-4px)' },
        },
        hover: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}
