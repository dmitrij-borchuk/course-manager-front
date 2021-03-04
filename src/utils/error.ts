import { ApolloError } from '@apollo/client'

export const parseError = (error: ApolloError): string[] => {
  if (error.graphQLErrors.length === 0) {
    return [error.networkError?.message || '']
  }
  return error.graphQLErrors
    .map((item) => {
      if (!item.extensions) {
        return item.message
      }

      return item.extensions.exception.data.message.map((message: any) => message.messages.map((m: any) => m.id))
    })
    .flat(3)
}
