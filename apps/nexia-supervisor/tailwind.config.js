/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nexia: {
          50: '#f0f0ff',
          100: '#e6e6ff',
          200: '#d1d1ff',
          300: '#b3b3ff',
          400: '#8080ff',
          500: '#6b46c1',
          600: '#553c9a',
          700: '#44337a',
          800: '#362a5a',
          900: '#2a1f3d',
          primary: '#6b46c1',
          secondary: '#553c9a',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          dark: '#1F2937',
          light: '#F9FAFB'
        }
      },
      backgroundImage: {
        'nexia-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}