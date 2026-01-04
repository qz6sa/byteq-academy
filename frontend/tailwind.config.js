/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00d4ff',
        secondary: '#7b2cbf',
        accent: '#ff006e',
        success: '#06ffa5',
        warning: '#ffd60a',
        danger: '#ff0054',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00d4ff 0%, #0099cc 50%, #006699 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #7b2cbf 0%, #5a1f8f 50%, #3a0f5f 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ff006e 0%, #cc0058 50%, #990042 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 212, 255, 0.5)',
        'glow-secondary': '0 0 20px rgba(123, 44, 191, 0.5)',
        'glow-accent': '0 0 20px rgba(255, 0, 110, 0.5)',
        'glow-success': '0 0 20px rgba(6, 255, 165, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-in',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.8)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
