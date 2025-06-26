// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust this path to match your project structure
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e293b",
        accent: "#2563eb",
        surface: "rgba(34,42,53,0.7)",
        border: "#94a3b8",
        'custom-light-bg': '#f5f5f3', // Old money off-white
        'custom-dark-bg-start': '#183153',  // Old money navy
        'custom-dark-bg-end': '#2d4739',  // Old money green
        'custom-gold': '#bfa76a', // Old money gold
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'cosmic': '0 4px 32px 0 rgba(36,56,99,0.20)',
      },
      backdropBlur: {
        md: '8px',
      },
      backgroundImage: theme => ({
        'dark-gradient': 'linear-gradient(to right, #183153, #2d4739)',
      }),
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwind-scrollbar')
  ],
};
