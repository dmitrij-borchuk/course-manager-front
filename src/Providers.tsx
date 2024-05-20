import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { ReactQueryDevtools } from 'react-query/devtools'
import { HelmetProvider } from 'react-helmet-async'
import { ToastProvider } from 'react-toast-notifications'
import { IntlProvider } from 'react-intl'
import { ActivitiesFilteringProvider } from 'modules/activities/activitiesFilteringContext'
import messages from './intl/messagesEn'
import ConstateStoreProvider, { StoreProvider } from './store'
import { MuiThemeProvider } from './MuiThemeProvider'
import { NavBarProvider } from 'components/layouts/NavBar'

const queryClient = new QueryClient()

interface Props {}
export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider>
          <Router>
            <ConstateStoreProvider>
              <IntlProvider messages={messages} locale="en" defaultLocale="en">
                <ToastProvider>
                  <HelmetProvider>
                    <NavBarProvider>
                      <ActivitiesFilteringProvider>{children}</ActivitiesFilteringProvider>
                    </NavBarProvider>
                  </HelmetProvider>
                </ToastProvider>
              </IntlProvider>
            </ConstateStoreProvider>
          </Router>
        </MuiThemeProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StoreProvider>
  )
}
