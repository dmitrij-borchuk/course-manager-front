import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useOrganizationsState, useUsersState } from '../../store'
import { Profile } from '../../components/profile/Profile'
import { useNotification } from '../../hooks/useNotification'
import { TITLE_POSTFIX } from '../../config'

export const ProfilePage = () => {
  const { fetchAll, allItems, loading } = useOrganizationsState()
  const { fetchProfile, profile } = useUsersState()
  const { showError } = useNotification()

  useEffect(() => {
    fetchAll()
  }, [fetchAll])
  useEffect(() => {
    fetchProfile().catch((error) => {
      showError(error.message)
    })
  }, [fetchProfile, showError])

  return (
    <>
      <Helmet>
        <title>Profile{TITLE_POSTFIX}</title>
      </Helmet>

      <Profile organizations={allItems} user={profile} organizationsLoading={loading} />
    </>
  )
}
