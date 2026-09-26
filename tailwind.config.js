/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Background (Dark Mode)
        'bg-primary': '#0F0F14',
        'bg-secondary': '#1A1A24',
        'bg-tertiary': '#252530',

        // Brand
        'bnb-gold': '#F0B90B',
        'emerald': '#10B981',
        'emerald-dark': '#059669',

        // Text
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A1AA',
        'text-muted': '#71717A',

        // Status / Security Badge
        'status-green': '#10B981',
        'status-yellow': '#F59E0B',
        'status-red': '#EF4444',

        // Functional
        'error': '#EF4444',
        'border': '#2E2E3A',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
    },
  },
  plugins: [],
};
