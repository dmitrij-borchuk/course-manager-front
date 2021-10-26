import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import { IntlProvider } from 'react-intl'
import messages from './intl/messagesEn'
import StoreProvider from './store'

interface Props {}
export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <Router>
      <StoreProvider>
        <IntlProvider messages={messages} locale="en" defaultLocale="en">
          <ToastProvider>{children}</ToastProvider>
        </IntlProvider>
      </StoreProvider>
    </Router>
  )
}
