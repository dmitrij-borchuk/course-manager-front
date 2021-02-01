import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { parseError } from '../utils/error'

export function useMutationWithRedirect<T>(mutation: (data: T) => void, route: string) {
  let history = useHistory()
  const { formatMessage } = useIntl()
  const { addToast } = useToasts()
  const call = useCallback(
    async (data: T) => {
      try {
        await mutation(data)

        history.push(route)
      } catch (error) {
        const massages = parseError(error).map((key) => formatMessage({ id: key }))
        addToast(massages.join(';'), {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [mutation, addToast, formatMessage, history, route]
  )

  return call
}
