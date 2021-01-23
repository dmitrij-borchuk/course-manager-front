import { ApolloError } from '@apollo/client'

export const parseError = (error: ApolloError): string[] => {
  return error.graphQLErrors
    .map((item) => {
      if (!item.extensions) {
        return item.message
      }

      return item.extensions.exception.data.message.map((message: any) => message.messages.map((m: any) => m.id))
    })
    .flat(3)
}
