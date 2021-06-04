import { useMemo } from 'react'
import { useLocation } from 'react-router'

export function useQuery() {
  const location = useLocation()

  return useMemo(() => new URLSearchParams(location.search), [location.search])
}
