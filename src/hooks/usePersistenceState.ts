import { useEffect, useState } from 'react'
import { getItem, setItem } from '../services/localStore'

export function usePersistenceState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(getItem(key) || defaultValue)

  useEffect(() => {
    setItem(key, state)
  }, [state, key])

  return [state, setState] as const
}
