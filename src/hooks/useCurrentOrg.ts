import { useOrganizationsState } from '../store'
import { useOrgIdNotStrict } from './useOrgId'

export function useCurrentOrg() {
  const orgKey = useOrgIdNotStrict()
  const { allItems } = useOrganizationsState()
  const organization = allItems.find((org) => org.key === orgKey)

  return organization
}
