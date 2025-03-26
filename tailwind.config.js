/** @type {import('tailwindcss').Config} */

/*
#0a0a0a
#373737
#b3b3b3
#ffffff
#eaffff
#d3ebeb
#a0caca
#5ac8b2
#007a80
#0a3d2f
#e8d396
#ebc655
#bfb064
#e9e0d9
#d08c7e
#d96c40
oklch(0.511 0.096 186.391)
*/

module.exports = {
  content: [
    "./src/*.{js,jsx,ts,tsx,html,php,twig}",
    "./src/**/*.{js,jsx,ts,tsx,html,php,twig}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#d3ebeb',
        'primary-light': '#eaffff',
        'primary-dark': '#a0caca',
        'secondary': '#007a80',
        'secondary-light': '#5ac8b2',
        'secondary-dark': '#0a3d2f',
        'info': '#ebc655',
        'info-light': '#e8d396',
        'info-dark': '#bfb064',
        'success':'#d08c7e',
        'success-light': '#e9e0d9',
        'success-dark': '#d96c40',
        'text': '#0a0a0a',
        'text-secondary': '#373737',
        'text-disabled': '#b3b3b3',
        'text-inverse': '#ffffff',
        },
      },
      fontFamily: {
        'sans': ['"ui-sans-serif", "Helvetica", "Arial", sans-serif'],
        'title': ['"title", serif'],
        'regular': ['"regular", sans-serif'],
        'italic': ['"italic", sans-serif'],
        'bold': ['"bold", sans-serif'],
      },
    },
  plugins: [],
}