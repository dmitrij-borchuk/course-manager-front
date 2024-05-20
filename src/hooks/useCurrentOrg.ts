import { useAppSelector } from 'store/hooks'

export function useCurrentOrg() {
  const currentOrg = useAppSelector((state) => state.organizations.currentOrg.data)

  return currentOrg
}
