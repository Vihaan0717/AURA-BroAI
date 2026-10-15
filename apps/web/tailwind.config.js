/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep Pine & Emerald (Reference A dark forest-green tones)
        pine: {
          950: '#07120e',
          900: '#0b1b15',
          850: '#0f241d',
          800: '#142f26',
          700: '#1c4236',
          600: '#255848',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        // Charcoal & Obsidian
        charcoal: {
          950: '#0a0d0f',
          900: '#101417',
          850: '#151b20',
          800: '#1c242b',
          700: '#26313a',
          600: '#384653',
        },
        // Pearl & Mist
        pearl: {
          50: '#fbfcfb',
          100: '#f4f6f5',
          200: '#e8ecea',
          300: '#d7dfdc',
          400: '#bcc7c3',
        },
        // Misty Lavender (soft pastel highlights)
        lavender: {
          300: '#d4d2fd',
          400: '#aba8fa',
          500: '#8b8df8',
          600: '#7173e6',
        },
        // Sage
        sage: {
          200: '#c5d3c8',
          300: '#a3b8a8',
          400: '#839e89',
          500: '#64856b',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.16), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.25), 0 4px 12px 0 rgba(0, 0, 0, 0.1)',
        'glass-pine': '0 12px 40px -8px rgba(11, 27, 21, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'composer': '0 20px 50px -10px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'composer-light': '0 20px 45px -12px rgba(16, 20, 23, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
        lg: '20px',
        xl: '32px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
