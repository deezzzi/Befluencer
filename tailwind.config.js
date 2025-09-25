module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: 'oklch(51.01% 0.274 263.83)',
          violet: 'oklch(53.18% 0.28 296.97)',
          violetDark: 'oklch(47.66% 0.246 305.88)',
          pink: 'oklch(69.02% 0.277 332.77)',
          red: 'oklch(61.42% 0.238 15.34)',
          orange: 'oklch(63.32% 0.24 31.68)'
        },
        gray: {
          900: 'oklch(19.37% 0.006 300.98)',
          700: 'oklch(36.98% 0.014 302.71)',
          400: 'oklch(70.9% 0.015 304.04)'
        }
      },
      width: { sidebar: '260px' },
      boxShadow: { card: '0 2px 4px -2px rgba(0,0,0,0.06), 0 4px 12px -2px rgba(0,0,0,0.08)' },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        tight: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif']
      },
      container: { center: true, padding: '1rem' }
    }
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        ':root': {
          '--color-gradient-horizontal': 'linear-gradient(90deg, oklch(63.32% 0.24 31.68) 0%, oklch(69.02% 0.277 332.77) 50%, oklch(53.18% 0.28 296.97) 100%)',
          '--color-gradient-vertical': 'linear-gradient(180deg, oklch(63.32% 0.24 31.68) 0%, oklch(69.02% 0.277 332.77) 50%, oklch(53.18% 0.28 296.97) 100%)'
        }
      });
    }
  ]
};
