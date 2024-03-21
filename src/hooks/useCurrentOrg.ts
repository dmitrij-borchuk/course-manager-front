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
      // TODO: don't need to fetch all organizations to get the current one
      fetchAll()
    }
  }, [byId, fetchAll, loading])

  return organization
}
