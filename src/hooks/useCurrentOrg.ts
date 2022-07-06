import { useEffect } from 'react'
import { useOrganizationsState } from '../store'
import { useOrgIdNotStrict } from './useOrgId'

export function useCurrentOrg() {
  const orgKey = useOrgIdNotStrict()
  const { allItems, fetchAll, loading, byId } = useOrganizationsState()
  const organization = allItems.find((org) => org.key === orgKey)

  useEffect(() => {
    if (!loading && !byId) {
      // TODO: currently this method is called multiple times
      fetchAll()
    }
  }, [byId, fetchAll, loading])

  return organization
}
