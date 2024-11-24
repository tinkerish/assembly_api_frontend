/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0px 0px 10px -1px rgba(0, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};
