import { useMemo } from 'react'

export function useMapToArray<K, V>(map: Map<K, V>) {
  return useMemo(() => {
    return [...map.values()]
  }, [map])
}
