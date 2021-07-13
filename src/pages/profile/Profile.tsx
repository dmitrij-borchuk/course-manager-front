import React, { useEffect } from 'react'
import { Profile } from '../../components/profile/Profile'
import { useAuthState, useOrganizationsState } from '../../store'

export const ProfilePage = () => {
  const { fetchAll, allItems } = useOrganizationsState()
  const { currentUser } = useAuthState()

  useEffect(() => {
    if (currentUser?.uid) {
      fetchAll(currentUser?.uid)
    }
  }, [currentUser?.uid, fetchAll])

  return <Profile organizations={allItems} />
}
