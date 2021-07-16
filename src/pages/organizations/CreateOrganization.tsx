import { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { useAuthState, useOrganizationsState } from '../../store'
import { EditOrganization, OrganizationForm } from '../../components/organizations/EditOrganization'
import { ROUTES } from '../../constants'

export const CreateOrganizationPage = () => {
  const history = useHistory()
  const { save, submitting } = useOrganizationsState()
  const { currentUser } = useAuthState()
  const { addToast } = useToasts()
  const submit = useCallback(
    async (data: OrganizationForm) => {
      if (currentUser?.uid) {
        await save({
          ...data,
          creator: currentUser.uid,
        })

        history.push(`${ROUTES.ROOT}`)
      } else {
        addToast(<FormattedMessage id="organizations.edit.noUserId" />, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, currentUser?.uid, history, save]
  )

  return <EditOrganization onSubmit={submit} loading={submitting} />
}

export default CreateOrganizationPage
