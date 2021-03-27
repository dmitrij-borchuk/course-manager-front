import { AxiosError } from 'axios'
import { CustomError } from '../types/error'

export const parseError = (error: AxiosError): CustomError => {
  if (!error.isAxiosError) {
    return {
      unknown: error,
    }
  }

  if (!error.response?.data.message.length) {
    // TODO: investigate cases
    return {
      unknown: error,
    }
  }
  return {
    fields: error.response?.data.message
      .map((item: any) => {
        return item.messages.map((message: any) => ({
          field: message.field[0],
          messageId: message.id,
          message: message.message,
        }))
      })
      .flat(3),
  }
}
