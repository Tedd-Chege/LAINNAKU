// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust this path to match your project structure
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'custom-light-bg': '#f8fafc', // Custom light background color
        'custom-dark-bg-start': '#1a202c',  // Custom dark gradient start color
        'custom-dark-bg-end': '#2d3748',  // Custom dark gradient end color
        // Add more custom colors if needed
      },
      backgroundImage: theme => ({
        'dark-gradient': 'linear-gradient(to right, #1a202c, #2d3748)',
      }),
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwind-scrollbar')
  ],
};
