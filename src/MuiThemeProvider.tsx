import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import '@mui/lab/themeAugmentation'

interface Props {
  children: React.ReactNode
}
export function MuiThemeProvider({ children }: Props) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#346473',
    },
  },
  typography: {
    fontFamily: "'Red Hat Display', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          height: '45px',
          paddingInline: '28px',
          fontSize: '15px',
        },
      },
    },
  },
})
