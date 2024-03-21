import React from 'react'
import {
  PaletteColor,
  PaletteColorOptions,
  ThemeProvider,
  alpha,
  createTheme,
  getContrastRatio,
} from '@mui/material/styles'
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
    secondary: {
      main: '#25A55F',
    },
    accent: {
      main: '#9BDF46',
      light: alpha('#9BDF46', 0.5),
      dark: alpha('#9BDF46', 0.9),
      contrastText: getContrastRatio('#9BDF46', '#fff') > 4.5 ? '#fff' : '#111',
    },
  },
  typography: {
    fontFamily: "'Red Hat Display', sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'large',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          // TODO: needs to be clarified with design
          // impact on `ButtonGroup` component (report sorting)
          // height: '45px',
          // fontSize: '15px',
          // paddingInline: '28px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: (ownerState) => ({
          boxShadow: 'none',
          borderBottom: '1px solid #E5E5E5',
          color: ownerState.theme.palette.text.primary,
        }),
        colorPrimary: {
          backgroundColor: '#fff',
        },
      },
    },
  },
})

declare module '@mui/material/styles' {
  interface Palette {
    accent: PaletteColor
  }

  interface PaletteOptions {
    accent?: PaletteColorOptions
  }
}
