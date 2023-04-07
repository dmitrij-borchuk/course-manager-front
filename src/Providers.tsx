import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ToastProvider } from 'react-toast-notifications'
import { IntlProvider } from 'react-intl'
import { ActivitiesFilteringProvider } from 'modules/activities/activitiesFilteringContext'
import messages from './intl/messagesEn'
import StoreProvider from './store'
import { MuiThemeProvider } from './MuiThemeProvider'

const queryClient = new QueryClient()

interface Props {}
export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider>
        <Router>
          <StoreProvider>
            <IntlProvider messages={messages} locale="en" defaultLocale="en">
              <ToastProvider>
                <ActivitiesFilteringProvider>{children}</ActivitiesFilteringProvider>
              </ToastProvider>
            </IntlProvider>
          </StoreProvider>
        </Router>
      </MuiThemeProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
