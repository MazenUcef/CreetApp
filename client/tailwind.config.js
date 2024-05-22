/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#0c4a60',
       secondary: '#ef6c33',
       third:"#7d8e95"
      },
    },
  },
  plugins: [],
}
