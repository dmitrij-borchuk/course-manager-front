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
          // TODO: needs to be clarified with design
          // impact on `ButtonGroup` component (report sorting)
          // height: '45px',
          // fontSize: '15px',
          // borderRadius: '12px',
          // paddingInline: '28px',
        },
      },
    },
  },
})
