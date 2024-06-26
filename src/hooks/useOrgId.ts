import { useCurrentOrg } from './useCurrentOrg'

export function useOrgId() {
  const currentOrg = useCurrentOrg()

  if (!currentOrg) {
    throw new Error('Organization is not set')
  }

  return currentOrg.key
}
