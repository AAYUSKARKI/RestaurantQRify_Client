// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'slow-pan': 'slow-pan 20s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        'slow-pan': {
          '0%': { transform: 'scale(1) translateX(0)' },
          '100%': { transform: 'scale(1.1) translateX(-2%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  }
}