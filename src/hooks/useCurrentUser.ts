import { useEffect, useMemo } from 'react'
import { useAuthState, useUsersState } from '../store'
import { useCurrentOrg } from './useCurrentOrg'

export function useCurrentUser() {
  const org = useCurrentOrg()
  const { currentUser, loading } = useAuthState()
  const { fetchOrgUser, fetching, users } = useUsersState()
  // TODO: fetch profile
  const organizationUser = users.find((user) => user.outerId === currentUser?.uid)
  const isLoading = loading || fetching

  useEffect(() => {
    if (!org || !currentUser) {
      return
    }
    fetchOrgUser(org.id, currentUser.uid)
  }, [currentUser, fetchOrgUser, org])

  return useMemo(
    () => ({
      currentUser,
      // TODO: remove
      organizationUser,
      loading: isLoading,
    }),
    [currentUser, isLoading, organizationUser]
  )
}
