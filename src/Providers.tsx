import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import { IntlProvider } from 'react-intl'
import messages from './intl/messagesEn'
import StoreProvider from './store'
import { MuiThemeProvider } from './MuiThemeProvider'

interface Props {}
export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <MuiThemeProvider>
      <Router>
        <StoreProvider>
          <IntlProvider messages={messages} locale="en" defaultLocale="en">
            <ToastProvider>{children}</ToastProvider>
          </IntlProvider>
        </StoreProvider>
      </Router>
    </MuiThemeProvider>
  )
}
