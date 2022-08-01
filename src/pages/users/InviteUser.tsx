import { useCallback, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { InviteUser } from '../../components/users/InviteUser'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import useUsersStore from '../../store/usersStore'
import { TITLE_POSTFIX } from '../../config'

export const InviteUserPage = () => {
  const { submitting, inviteUser } = useUsersStore()
  const org = useCurrentOrg()
  const [link, setLink] = useState('')
  const { addToast } = useToasts()
  const onSubmit = useCallback(
    async (data) => {
      if (org) {
        try {
          const result = (await inviteUser(org.id, data)).data

          if (result.id) {
            setLink(`${document.location.origin}/${org.key}/invite/confirm/${result.token}`)
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
    [addToast, inviteUser, org]
  )
  const onDialogClose = useCallback(() => {
    setLink('')
  }, [])

  return (
    <>
      <Helmet>
        <title>Invite Users{TITLE_POSTFIX}</title>
      </Helmet>
      <InviteUser onSubmit={onSubmit} loading={submitting} inviteLink={link} onDialogClose={onDialogClose} />
    </>
  )
}
