import { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { EditGroup, GroupForm } from '../../components/groups/EditGroup'
import { TITLE_POSTFIX } from '../../config'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { useActivitiesState } from '../../store'

export const CreateGroupPage = () => {
  const { submitting, createActivity } = useActivitiesState()
  const history = useHistory()
  const { addToast } = useToasts()
  const orgKey = useOrgId()
  const submit = useCallback(
    async (data: GroupForm) => {
      if (orgKey) {
        try {
          await createActivity({
            ...data,
            type: 'group',
            performerId: null,
          })

          addToast(<FormattedMessage id="groups.create.success" />, {
            appearance: 'success',
            autoDismiss: true,
          })
          history.push(`/${orgKey}${ROUTES.GROUPS_LIST}`)
        } catch (error: any) {
          addToast(error.message, {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      }
    },
    [addToast, createActivity, history, orgKey]
  )

  return (
    <>
      <Helmet>
        <title>
          Create Group
          {TITLE_POSTFIX}
        </title>
      </Helmet>

      <EditGroup onSubmit={submit} loading={submitting} />
    </>
  )
}

export default CreateGroupPage
