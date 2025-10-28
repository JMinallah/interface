/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // Brand palette derived from the user's provided hex values
        brand: {
          primary: '#D6A99D', // main brand color
          accent: '#9CAFAA',  // secondary / accent color
          muted: '#D6DAC8',   // muted / border / subtle backgrounds
          bg: '#FBF3D5',      // page background
        },
      },
    },
  },
  plugins: [],
}

