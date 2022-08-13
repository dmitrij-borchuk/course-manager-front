import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import { IntlProvider } from 'react-intl'
import messages from './intl/messagesEn'
import StoreProvider from './store'
import { ThemeProvider, createTheme } from '@mui/material/styles'

interface Props {}
export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <StoreProvider>
          <IntlProvider messages={messages} locale="en" defaultLocale="en">
            <ToastProvider>{children}</ToastProvider>
          </IntlProvider>
        </StoreProvider>
      </Router>
    </ThemeProvider>
  )
}

const theme = createTheme({})
