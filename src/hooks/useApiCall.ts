import { useCallback, useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { CustomError } from '../types/error'
import { noop } from '../utils/common'
import { parseError } from '../utils/error'

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

// TODO: remove
export function useApiCall<T extends (...args: any) => any>(cb: T) {
  const { addToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [data, setData] = useState<ThenArg<ReturnType<T>> | undefined>(undefined)
  const call = useCallback(async () => {
    try {
      setLoading(true)
      const resp = await cb()
      setData(resp)
    } catch (error) {
      // TODO: add intl
      const massage = parseError(error)
      addToast(massage, {
        appearance: 'error',
        autoDismiss: true,
      })
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [cb, addToast])

  useEffect(() => {
    call()
  }, [call])

  return [data, loading, error] as const
}

// TODO: do we need it?
export function useApiCallLazy<T extends (...args: any) => any>(cb: T, done: () => void = noop) {
  const { addToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<CustomError>()
  const [data, setData] = useState<ThenArg<ReturnType<T>> | undefined>(undefined)
  const call = useCallback(
    async (...args: Parameters<T>) => {
      try {
        setLoading(true)
        const resp = await cb(...args)
        setData(resp)
        done()
      } catch (error) {
        const parsedError = parseError(error)
        // TODO: add intl
        if (parsedError.common) {
          addToast(parsedError.common, {
            appearance: 'error',
            autoDismiss: true,
          })
        }
        setError(parsedError)
      } finally {
        setLoading(false)
      }
    },
    [cb, done, addToast]
  )

  return [call, { data, loading, error }] as const
}
