import { useCallback } from 'react'
import { useParams } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { ConfirmInvite } from '../../components/users/ConfirmInvite'
import { useOrgId } from '../../hooks/useOrgId'
import { useOrganizationsState, useUsersState } from '../../store'
import { useAuthStore } from '../../store/authStore'
import { TITLE_POSTFIX } from '../../config'

export const ConfirmInvitePage = () => {
  const { addToast } = useToasts()
  const { submitting, confirmInvitation } = useUsersState()
  const { fetchAll } = useOrganizationsState()
  const { currentUser } = useAuthStore()
  const { token } = useParams<{ token: string }>()
  const orgId = useOrgId()
  const onSubmit = useCallback(async () => {
    if (orgId && currentUser?.uid) {
      // TODO: error handling
      try {
        await confirmInvitation(orgId, currentUser.uid, token, 'Teacher')
        await fetchAll()
      } catch (error: any) {
        addToast(error?.response?.data || error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    }
  }, [addToast, confirmInvitation, currentUser?.uid, fetchAll, orgId, token])

  return (
    <>
      <Helmet>
        <title>Confirm Invitation{TITLE_POSTFIX}</title>
      </Helmet>

      <ConfirmInvite onSubmit={onSubmit} loading={submitting} user={currentUser} />
    </>
  )
}
