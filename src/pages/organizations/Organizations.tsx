import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { fetchOrganizations } from 'modules/organizations/store/list'
import { GeneralPage } from 'components/layouts/GeneralPage'
import { useUsersState } from '../../store'
import { Organizations } from '../../components/organizations/Organizations'
import { useNotification } from '../../hooks/useNotification'

export const OrganizationsPage = () => {
  const dispatch = useAppDispatch()
  const orgsList = useAppSelector((state) => state.organizations.list.data)
  const orgsLoading = useAppSelector((state) => state.organizations.list.loading)
  const { fetchProfile, profile } = useUsersState()
  const { showError } = useNotification()

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
      <GeneralPage title="Organizations">
        <Organizations organizations={orgsList} user={profile} organizationsLoading={orgsLoading} />
      </GeneralPage>
    </>
  )
}
