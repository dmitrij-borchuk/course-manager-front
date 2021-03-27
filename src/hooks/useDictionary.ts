import { useMemo } from 'react'
import { Dictionary } from '../types/dictionary'

export function useDictionary<T extends { id: string }>(list?: T[]) {
  return useMemo(() => {
    if (!list) {
      return {}
    }

    return list.reduce<Dictionary<T>>((acc, item) => {
      acc[item.id] = item

      return acc
    }, {})
  }, [list])
}
