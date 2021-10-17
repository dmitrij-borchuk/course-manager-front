import { useCallback, useState } from 'react'
import { InviteUser } from '../../components/users/InviteUser'
import { useOrgId } from '../../hooks/useOrgId'
import useUsersStore from '../../store/usersStore'

export const InviteUserPage = () => {
  const { submitting, inviteUser } = useUsersStore()
  const orgId = useOrgId()
  const [link, setLink] = useState('')
  const onSubmit = useCallback(
    async (data) => {
      if (orgId) {
        // TODO: error handling
        const result = await inviteUser(orgId, data)

        if (result?.id) {
          setLink(`${document.location.origin}/${orgId}/invite/confirm/${result.id}`)
        }
      }
    },
    [inviteUser, orgId]
  )

  return <InviteUser onSubmit={onSubmit} loading={submitting} inviteLink={link} />
}
