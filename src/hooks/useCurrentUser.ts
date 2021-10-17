import { useEffect, useMemo } from 'react'
import { useAuthState, useUsersState } from '../store'
import { OrganizationUser } from '../types/user'
import { useOrgIdNotStrict } from './useOrgId'

export function useCurrentUser() {
  const orgId = useOrgIdNotStrict()
  const { currentUser, loading } = useAuthState()
  const { fetchOrgUser, usersById, fetching } = useUsersState()
  const organizationUser: OrganizationUser = usersById[currentUser?.uid || '']
  const isLoading = loading || fetching

  useEffect(() => {
    if (!orgId || !currentUser) {
      return
    }
    fetchOrgUser(orgId, currentUser.uid)
  }, [currentUser, fetchOrgUser, orgId])

  return useMemo(
    () => ({
      currentUser,
      organizationUser,
      loading: isLoading,
    }),
    [currentUser, isLoading, organizationUser]
  )
}
