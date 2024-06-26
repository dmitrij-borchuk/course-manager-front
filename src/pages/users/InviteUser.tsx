import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useNotification } from 'hooks/useNotification'
import { GeneralPage } from 'components/layouts/GeneralPage'
import { InviteForm } from 'types/invite'
import { InviteUser } from '../../components/users/InviteUser'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import useUsersStore from '../../store/usersStore'

export const InviteUserPage = () => {
  const intl = useIntl()
  const { submitting, inviteUser } = useUsersStore()
  const org = useCurrentOrg()
  const { showError, showSuccess } = useNotification()
  const onSubmit = useCallback(
    async (data: InviteForm) => {
      if (org) {
        try {
          await inviteUser(org.id, data)

          showSuccess(intl.formatMessage({ id: 'users.invite.success' }))
        } catch (error) {
          if (error instanceof Error) {
            showError(error.message)
          }
        }
      }
    },
    [intl, inviteUser, org, showError, showSuccess]
  )

  return (
    <>
      <GeneralPage title="Invite Users">
        <InviteUser onSubmit={onSubmit} loading={submitting} />
      </GeneralPage>
    </>
  )
}
