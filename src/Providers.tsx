import React from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ToastProvider } from 'react-toast-notifications'
import { IntlProvider } from 'react-intl'
import messages from './intl/messagesEn'
import { getAuthData } from './services/auth'

const httpLink = createHttpLink({
  // TODO: move to env vars
  uri: 'http://localhost:1337/graphql',
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getAuthData()
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
