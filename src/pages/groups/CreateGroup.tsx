import { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { EditGroup, GroupForm } from '../../components/groups/EditGroup'
import { ROUTES } from '../../constants'
import { useActivitiesState } from '../../store'

export const CreateGroupPage = () => {
  const { submitting, createActivity } = useActivitiesState()
  const history = useHistory()
  const { addToast } = useToasts()
  const submit = useCallback(
    async (data: GroupForm) => {
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
        history.push(`${ROUTES.GROUPS_LIST}`)
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, createActivity, history]
  )

  return (
    <>
      <EditGroup onSubmit={submit} loading={submitting} />
    </>
  )
}

export default CreateGroupPage
