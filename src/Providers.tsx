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
        <ToastProvider>
          <IntlProvider messages={messages} locale="en" defaultLocale="en">
            {children}
          </IntlProvider>
        </ToastProvider>
      </StoreProvider>
    </Router>
  )
}
