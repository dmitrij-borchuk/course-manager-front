import { useEffect, useMemo } from 'react'
import { useAuthState, useUsersState } from '../store'
import { OrganizationUser } from '../types/user'
import { useOrgIdNotStrict } from './useOrgId'

export function useCurrentUser() {
  const orgId = useOrgIdNotStrict()
  const { currentUser } = useAuthState()
  const { fetchOrgUser, usersById } = useUsersState()
  const organizationUser: OrganizationUser = usersById[currentUser?.uid || '']

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
    }),
    [currentUser, organizationUser]
  )
}