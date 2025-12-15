/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./themes/careercanvas/**/*.html",
    "./themes/careercanvas/**/*.js",
    "./content/**/*.md",
    "./layouts/**/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}