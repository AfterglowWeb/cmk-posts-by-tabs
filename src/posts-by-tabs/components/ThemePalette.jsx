import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
*/
const theme = createTheme({
  palette: {
    text: {
      primary:'#0a0a0a',
      secondary:'#373737',
      disabled:'#b3b3b3',
    },
    primary:{
      light: '#eaffff',
      main: '#d3ebeb',
      dark: '#a0caca',
      contrastText: '#0a0a0a',
    },
    secondary:{
      light: '#5ac8b2',
      main: '#007a80',
      dark: '#0a3d2f',
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
      fontFamily: '"title", serif'
    },
    h2: {
      fontFamily: '"bold", serif'
    },
    h3: {
      fontFamily: '"bold", serif'
    },
    h4: {
      fontFamily: '"bold", serif'
    },
    h5: {
      fontFamily: '"bold", serif'
    },
    h6: {
      fontFamily: '"bold", serif'
    },
    p: {
      fontFamily: '"regular", sans-serif'
    },
    a: {
      fontFamily: '"regular", sans-serif'
    },
    button: {
      fontFamily: '"regular", sans-serif'
    },
    strong: {
      fontFamily: '"bold", sans-serif'
    },
    b: {
      fontFamily: '"bold", sans-serif'
    },
    em: {
      fontFamily: '"italic", sans-serif'
    },
    i: {
      fontFamily: '"italic", sans-serif'
    },
    blockquote: {
      fontFamily: '"italic", sans-serif'
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