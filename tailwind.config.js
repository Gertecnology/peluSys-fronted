/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layout/**/*.{js,ts,jsx,tsx}',
    './src/shared/**/*.{js,ts,jsx,tsx}',

  ],
  theme: {
    extend: {
      colors: {
        'blueEdition': '#1D158C',
        'bgEdition': '#F1f6FB'

      }
    },
  },
  plugins: [],
}

