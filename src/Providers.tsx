import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import { IntlProvider } from 'react-intl'
import messages from './intl/messagesEn'
import StoreProvider from './store'
import { MuiThemeProvider } from './MuiThemeProvider'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

interface Props {}
export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider>
        <Router>
          <StoreProvider>
            <IntlProvider messages={messages} locale="en" defaultLocale="en">
              <ToastProvider>{children}</ToastProvider>
            </IntlProvider>
          </StoreProvider>
        </Router>
      </MuiThemeProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
