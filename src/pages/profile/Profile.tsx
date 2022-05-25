import React, { useEffect } from 'react'
import { useAuthState, useOrganizationsState, useUsersState } from '../../store'
import { Profile } from '../../components/profile/Profile'
import { useNotification } from '../../hooks/useNotification'

export const ProfilePage = () => {
  const { fetchAll, allItems, loading } = useOrganizationsState()
  const { currentUser } = useAuthState()
  const { fetchProfile, profile } = useUsersState()
  const { showError } = useNotification()

  useEffect(() => {
    if (currentUser?.uid) {
      fetchAll(currentUser?.uid)
    }
  }, [currentUser?.uid, fetchAll])
  useEffect(() => {
    fetchProfile().catch((error) => {
      showError(error.message)
    })
  }, [fetchProfile, showError])

  return <Profile organizations={allItems} user={profile} organizationsLoading={loading} />
}
