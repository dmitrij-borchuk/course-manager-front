import { useEffect } from 'react'
import { useOrganizationsState, useUsersState } from '../../store'
import { Organizations } from '../../components/organizations/Organizations'
import { useNotification } from '../../hooks/useNotification'
import { GeneralPage } from 'components/layouts/GeneralPage'

export const OrganizationsPage = () => {
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
      <GeneralPage title="Organizations">
        <Organizations organizations={allItems} user={profile} organizationsLoading={loading} />
      </GeneralPage>
    </>
  )
}
