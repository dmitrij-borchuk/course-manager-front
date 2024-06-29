import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { ReactQueryDevtools } from 'react-query/devtools'
import { HelmetProvider } from 'react-helmet-async'
import { ToastProvider } from 'react-toast-notifications'
import { IntlProvider } from 'react-intl'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SnackbarProvider } from 'notistack'
import { ActivitiesFilteringProvider } from 'modules/activities/activitiesFilteringContext'
import messages from './intl/messagesEn'
import ConstateStoreProvider, { StoreProvider } from './store'
import { MuiThemeProvider } from './MuiThemeProvider'
import { NavBarProvider } from 'components/layouts/NavBar'

const queryClient = new QueryClient()

interface Props {
  children: React.ReactNode
}
export const Providers = ({ children }: Props) => {
  return (
    <>
      <IntlProvider messages={messages} locale="en" defaultLocale="en">
        <SnackbarProvider />
        <StoreProvider>
          <QueryClientProvider client={queryClient}>
            <MuiThemeProvider>
              <Router>
                <ConstateStoreProvider>
                  <ToastProvider>
                    <HelmetProvider>
                      <NavBarProvider>
                        <ActivitiesFilteringProvider>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
                        </ActivitiesFilteringProvider>
                      </NavBarProvider>
                    </HelmetProvider>
                  </ToastProvider>
                </ConstateStoreProvider>
              </Router>
            </MuiThemeProvider>

            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </StoreProvider>
      </IntlProvider>
    </>
  )
}
