import { useCallback } from 'react'
import { useParams } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import { ConfirmInvite } from '../../components/users/ConfirmInvite'
import { useOrgId } from '../../hooks/useOrgId'
import { useAuthStore } from '../../store/authStore'
import useUsersStore from '../../store/usersStore'

export const ConfirmInvitePage = () => {
  const { addToast } = useToasts()
  const { submitting, confirmInvitation } = useUsersStore()
  const { currentUser } = useAuthStore()
  const { token } = useParams<{ token: string }>()
  const orgId = useOrgId()
  const onSubmit = useCallback(async () => {
    if (orgId && currentUser?.uid) {
      // TODO: error handling
      try {
        await confirmInvitation(orgId, currentUser.uid, token, 'Teacher')
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    }
  }, [addToast, confirmInvitation, currentUser?.uid, orgId, token])

  return <ConfirmInvite onSubmit={onSubmit} loading={submitting} user={currentUser} />
}
