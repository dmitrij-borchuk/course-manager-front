import { useEffect } from 'react'

export function useUpdateInitialForm<T, K extends keyof T>(setValue: (key: K, value: T[K]) => void, initial: T) {
  useEffect(() => {
    for (const key in initial) {
      if (Object.prototype.hasOwnProperty.call(initial, key)) {
        const element = initial[(key as unknown) as K]
        setValue((key as unknown) as K, element)
      }
    }
  }, [initial, setValue])
}
