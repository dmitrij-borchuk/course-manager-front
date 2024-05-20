import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setCurrentOrganization } from 'modules/organizations/store/currentOrg'
import { fetchOrganizations } from 'modules/organizations/store/list'
import { Organization } from 'types/organization'
import { NoSidebarPage } from 'components/layouts/NoSidebarPage'
import { useUsersState } from '../../store'
import { Organizations } from '../../components/organizations/Organizations'
import { useNotification } from '../../hooks/useNotification'

export const OrganizationsPage = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const orgsList = useAppSelector((state) => state.organizations.list.data)
  const orgsLoading = useAppSelector((state) => state.organizations.list.loading)
  const { fetchProfile, profile } = useUsersState()
  const { showError } = useNotification()

  const onOrgSelected = async (org: Organization) => {
    await dispatch(setCurrentOrganization(org))
    history.push(`/`)
  }

  useEffect(() => {
    dispatch(fetchOrganizations())
  }, [dispatch])
  useEffect(() => {
    fetchProfile().catch((error) => {
      showError(error.message)
    })
  }, [fetchProfile, showError])

  return (
    <>
      <NoSidebarPage title="Organizations">
        <Organizations
          organizations={orgsList}
          user={profile}
          organizationsLoading={orgsLoading}
          onOrgSelected={onOrgSelected}
        />
      </NoSidebarPage>
    </>
  )
}
