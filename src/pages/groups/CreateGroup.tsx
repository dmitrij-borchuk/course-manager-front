import { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useToasts } from 'react-toast-notifications'
import { EditGroup, GroupForm } from '../../components/groups/EditGroup'
import { Loader } from '../../components/kit/loader/Loader'
import { useOrgId } from '../../hooks/useOrgId'
import { useGroupsState } from '../../store'

export const CreateGroupPage = () => {
  const { createGroup, fetching, submitting } = useGroupsState()
  const { addToast } = useToasts()
  const orgId = useOrgId()
  const submit = useCallback(
    async (data: GroupForm) => {
      if (orgId) {
        try {
          await createGroup(orgId, {
            ...data,
          })

          addToast(<FormattedMessage id="groups.create.success" />, {
            appearance: 'success',
            autoDismiss: true,
          })
        } catch (error: any) {
          addToast(error.message, {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      }
    },
    [addToast, createGroup, orgId]
  )

  return (
    <Loader show={fetching}>
      <EditGroup onSubmit={submit} loading={submitting} />
    </Loader>
  )
}

export default CreateGroupPage
