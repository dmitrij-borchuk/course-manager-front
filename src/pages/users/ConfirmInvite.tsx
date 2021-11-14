import { useCallback } from 'react'
import { useParams } from 'react-router'
import { ConfirmInvite } from '../../components/users/ConfirmInvite'
import { useOrgId } from '../../hooks/useOrgId'
import { useAuthStore } from '../../store/authStore'
import useUsersStore from '../../store/usersStore'

export const ConfirmInvitePage = () => {
  const { submitting, confirmInvitation } = useUsersStore()
  const { currentUser } = useAuthStore()
  const { token } = useParams<{ token: string }>()
  const orgId = useOrgId()
  const onSubmit = useCallback(async () => {
    if (orgId && currentUser?.uid) {
      // TODO: error handling
      await confirmInvitation(orgId, currentUser.uid, token, 'Teacher')
    }
  }, [confirmInvitation, currentUser?.uid, orgId, token])

  return <ConfirmInvite onSubmit={onSubmit} loading={submitting} />
}
