import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

export function useCallbackWithRedirect<T>(cb: (data: T) => void, route: string) {
  let history = useHistory()
  const call = useCallback(
    async (data: T) => {
      await cb(data)

      history.push(route)
    },
    [cb, history, route]
  )

  return call
}
