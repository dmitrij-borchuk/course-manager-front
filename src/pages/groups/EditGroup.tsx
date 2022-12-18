import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { FormattedMessage } from 'react-intl'
import { Helmet } from 'react-helmet'
import { useGroupsState } from '../../store'
import { ROUTES } from '../../constants'
import { EditGroup, GroupForm } from '../../components/groups/EditGroup'
import { Loader } from '../../components/kit/loader/Loader'
import { useOrgId } from '../../hooks/useOrgId'
import { TITLE_POSTFIX } from '../../config'

export const EditGroupPage = () => {
  const history = useHistory()
  const orgKey = useOrgId()
  const params = useParams<{ id: string }>()
  const id = parseInt(params.id, 10)
  const { addToast } = useToasts()
  const { fetchGroup, editGroup, fetching, submitting, groupsById } = useGroupsState()

  const group = groupsById.get(id)
  const update = useCallback(
    async (data: GroupForm) => {
      if (!group) {
        return
      }
      try {
        await editGroup(group.id, data)
        history.push(`/${orgKey}${ROUTES.GROUPS_ROOT}/${group.id}`)

        addToast(<FormattedMessage id="groups.edit.success" />, {
          appearance: 'success',
          autoDismiss: true,
        })
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, editGroup, group, history, orgKey]
  )

  useEffect(() => {
    fetchGroup(id)
  }, [fetchGroup, id])
  // TODO: implement 404

  return (
    <>
      <Helmet>
        <title>
          Edit Group
          {TITLE_POSTFIX}
        </title>
      </Helmet>

      <Loader show={fetching}>
        <EditGroup onSubmit={update} loading={submitting} initial={group} isEdit />
      </Loader>
    </>
  )
}

export default EditGroupPage
