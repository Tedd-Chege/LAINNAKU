// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust this path to match your project structure
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'custom-light-bg': '#f5f5f3', // Old money off-white
        'custom-dark-bg-start': '#183153',  // Old money navy
        'custom-dark-bg-end': '#2d4739',  // Old money green
        'custom-gold': '#bfa76a', // Old money gold
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
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
