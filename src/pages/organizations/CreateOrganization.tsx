import { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { useOrganizationsState } from '../../store'
import { EditOrganization, OrganizationForm } from '../../components/organizations/EditOrganization'
import { ROUTES } from '../../constants'
import { isFirebaseError } from '../../utils/error'
import { ExternalError } from '../../hooks/useFormWithError'
import { useCurrentUser } from '../../hooks/useCurrentUser'

export const CreateOrganizationPage = () => {
  const history = useHistory()
  const intl = useIntl()
  const { save, submitting, allItems } = useOrganizationsState()
  const { currentUser } = useCurrentUser()
  const { addToast } = useToasts()
  const [error, setError] = useState<ExternalError<OrganizationForm>>()
  const submit = useCallback(
    async (data: OrganizationForm) => {
      // Check if we already have such org id
      if (allItems.find((o) => o.id === data.id)) {
        setError({
          fields: [
            {
              field: 'id',
              message: intl.formatMessage({ id: 'organizations.edit.conflict' }),
            },
          ],
        })

        return
      }
      if (currentUser?.uid) {
        try {
          await save({
            ...data,
            creator: currentUser.uid,
          })

          history.push(`${ROUTES.ROOT}`)
        } catch (error) {
          if (isFirebaseError(error) && error.code === 'permission-denied') {
            setError({
              fields: [
                {
                  field: 'id',
                  message: intl.formatMessage({ id: 'organizations.edit.conflict' }),
                },
              ],
            })
          }
        }
      } else {
        addToast(<FormattedMessage id="organizations.edit.noUserId" />, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, allItems, currentUser, history, intl, save]
  )

  return <EditOrganization onSubmit={submit} loading={submitting} error={error} />
}

export default CreateOrganizationPage
