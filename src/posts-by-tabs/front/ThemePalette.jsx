import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
const theme = createTheme({
  palette: {
    text: {
      primary:'#000000',
      secondary:'#373737',
      disabled:'#b3b3b3',
    },
    primary:{
      light: '#0c1923',
      main: '#091219',
      dark: '#010203',
      contrastText: '#ffffff',
    },
    secondary:{
      light: '#f47979',
      main: '#f56060',
      dark: '#f14d4d',
      contrastText: '#ffffff',
    },
    info:{
      light: '#e8d396',
      main: '#ebc655',
      dark: '#bfb064',
      contrastText: '#0a0a0a',
    },
    success:{
      light: '#e9e0d9',
      main: '#d08c7e',
      dark: '#d96c40',
      contrastText: '#0a0a0a',
    }
  },
  typography: {
    fontFamily: '"ui-sans-serif", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Archivo Black", sans-serif'
    },
    h2: {
      fontFamily: '"Archivo Black", sans-serif'
    },
    h3: {
      fontFamily: '"Archivo Black", sans-serif'
    },
    h4: {
      fontFamily: '"Archivo Black", sans-serif'
    },
    h5: {
      fontFamily: '"Archivo Black", sans-serif'
    },
    h6: {
      fontFamily: '"Archivo Black", sans-serif'
    },
    p: {
      fontFamily: '"Rubik", sans-serif'
    },
    a: {
      fontFamily: '"Rubik", sans-serif'
    },
    button: {
      fontFamily: '"Rubik", sans-serif'
    },
    strong: {
      fontFamily: '"Rubik", sans-serif'
    },
    b: {
      fontFamily: '"Rubik", sans-serif'
    },
    em: {
      fontFamily: '"Rubik", sans-serif'
    },
    i: {
      fontFamily: '"Rubik", sans-serif'
    },
    blockquote: {
      fontFamily: '"Rubik", sans-serif'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
})

export default function ThemePalette({children}) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}