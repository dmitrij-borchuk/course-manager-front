import React, { useEffect } from 'react'
import { useAuthState, useOrganizationsState, useUsersState } from '../../store'
import { Profile } from '../../components/profile/Profile'

export const ProfilePage = () => {
  const { fetchAll, allItems, loading } = useOrganizationsState()
  const { currentUser } = useAuthState()
  const { fetchProfile, profile } = useUsersState()

  useEffect(() => {
    if (currentUser?.uid) {
      fetchAll(currentUser?.uid)
    }
  }, [currentUser?.uid, fetchAll])
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return <Profile organizations={allItems} user={profile} organizationsLoading={loading} />
}
