/** @type {import('tailwindcss').Config} */
/*
#0a0a0a
#373737
#b3b3b3
#ffffff
#0c1923
#091219
#010203
#f47979
#f56060
#f14d4d 
#e8d396
#ebc655
#bfb064
#e9e0d9
#d08c7e
#d96c40
*/

module.exports = {
  content: [
    "./src/*.{js,jsx,ts,tsx,html,php,twig}",
    "./src/**/*.{js,jsx,ts,tsx,html,php,twig}"
  ],
  theme: {
    extend: {
      colors: {
        'text': '#0a0a0a',
        'text-secondary': '#373737',
        'text-disabled': '#b3b3b3',
        'text-inverse': '#ffffff',
        'primary-light': '#0c1923',
        'primary': '#091219',
        'primary-dark': '#010203',
        'secondary-light': '#f47979',
        'secondary': '#f56060',
        'secondary-dark': '#f14d4d',
        'info-light': '#e8d396',
        'info': '#ebc655',
        'info-dark': '#bfb064',
        'success-light': '#e9e0d9',
        'success':'#d08c7e',
        'success-dark': '#d96c40',
        },
      },
      fontFamily: {
        'sans': ['"ui-sans-serif", "Helvetica", "Arial", sans-serif'],
        'title': ['"Archivo Black", sans-serif'],
        'content': ['"Rubik", sans-serif'],
        'italic': ['"Rubik Italic", sans-serif'],
        'bold': ['"Rubik ", sans-serif'],
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
    },
  plugins: [],
}