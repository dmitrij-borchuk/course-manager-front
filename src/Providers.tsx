import React from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { ToastProvider } from 'react-toast-notifications'
import { IntlProvider } from 'react-intl'
import messages from './intl/messagesEn'

const client = new ApolloClient({
  // TODO: move to env vars
  uri: 'http://localhost:1337/graphql',
  cache: new InMemoryCache(),
})

interface Props {}
export const Providers: React.FC<Props> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <ToastProvider>
        <IntlProvider messages={messages} locale="en" defaultLocale="en">
          {children}
        </IntlProvider>
      </ToastProvider>
    </ApolloProvider>
  )
}
