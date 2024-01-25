import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useOrganizationsState, useUsersState } from '../../store'
import { Organizations } from '../../components/organizations/Organizations'
import { useNotification } from '../../hooks/useNotification'
import { TITLE_POSTFIX } from '../../config'

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
      <Helmet>
        <title>Organizations{TITLE_POSTFIX}</title>
      </Helmet>

      <Organizations organizations={allItems} user={profile} organizationsLoading={loading} />
    </>
  )
}
