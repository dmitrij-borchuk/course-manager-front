import React, { useEffect } from 'react'
import { useAuthState, useOrganizationsState } from '../../store'
import { AppUser } from '../../types/user'
import { Profile } from '../../components/profile/Profile'

export const ProfilePage = () => {
  const { fetchAll, allItems, loading } = useOrganizationsState()
  const { currentUser } = useAuthState()
  const user: AppUser = {
    name: currentUser?.displayName || undefined,
    avatar: currentUser?.photoURL || undefined,
  }

  useEffect(() => {
    if (currentUser?.uid) {
      fetchAll(currentUser?.uid)
    }
  }, [currentUser?.uid, fetchAll])

  return <Profile organizations={allItems} user={user} organizationsLoading={loading} />
}
