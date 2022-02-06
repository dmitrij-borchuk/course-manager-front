import { useCallback, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { InviteUser } from '../../components/users/InviteUser'
import { useOrgId } from '../../hooks/useOrgId'
import useUsersStore from '../../store/usersStore'

export const InviteUserPage = () => {
  const { submitting, inviteUser } = useUsersStore()
  const orgId = useOrgId()
  const [link, setLink] = useState('')
  const { addToast } = useToasts()
  const onSubmit = useCallback(
    async (data) => {
      if (orgId) {
        try {
          const result = await inviteUser(orgId, data)

          if (result?.id) {
            setLink(`${document.location.origin}/${orgId}/invite/confirm/${result.id}`)
          }
        } catch (error) {
          if (error instanceof Error) {
            addToast(error.message, {
              appearance: 'error',
              autoDismiss: true,
            })
          }
        }
      }
    },
    [addToast, inviteUser, orgId]
  )

  return (
    <>
      <InviteUser onSubmit={onSubmit} loading={submitting} inviteLink={link} />
    </>
  )
}
