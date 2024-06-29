import { AxiosError } from 'axios'
import { isAxiosError } from 'api/request'
import { useToasts } from 'react-toast-notifications'
import { useIntl } from 'react-intl'

type FirebaseError = Error & {
  name: 'FirebaseError'
  code: string
}
export function isFirebaseError(error: any): error is FirebaseError {
  return error.name === 'FirebaseError'
}

export function defaultErrorParser(error: unknown) {
  if (isAxiosError(error)) {
    return
  }
}

export function useDefaultErrorHandler() {
  const intl = useIntl()
  const { addToast } = useToasts()

  return (error: unknown) => {
    let serverError: AxiosError | null = null
    if (isAxiosError<string>(error)) {
      addToast(error.response?.data, {
        appearance: 'error',
        autoDismiss: true,
      })
    } else if (error instanceof Error) {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    } else {
      addToast(intl.formatMessage({ id: 'common.unknownError' }), {
        appearance: 'error',
        autoDismiss: true,
      })
    }

    return {
      serverError,
    }
  }
}
