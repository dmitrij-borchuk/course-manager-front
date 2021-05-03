import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useGroupsState } from '../../store'
import { ROUTES } from '../../constants'
import { EditGroup, GroupForm } from '../../components/groups/EditGroup'
import { Loader } from '../../components/kit/loader/Loader'

export const EditGroupPage = () => {
  const history = useHistory()
  let { id } = useParams<{ id: string }>()
  const { fetchGroup, editGroup, fetching, submitting, groupsById } = useGroupsState()

  const group = groupsById[id]
  const update = useCallback(
    async (data: GroupForm) => {
      if (!group) {
        return
      }

      await editGroup({
        ...group,
        teacher: group.teacher?.id,
        students: group.students?.map((s) => s.id),
        ...data,
      })
      history.push(`${ROUTES.GROUPS_ROOT}/${group.id}`)
    },
    [editGroup, group, history]
  )

  useEffect(() => {
    fetchGroup(id)
  }, [fetchGroup, id])
  // TODO: implement 404

  return (
    <Loader show={fetching}>
      <EditGroup onSubmit={update} loading={submitting} initial={group} isEdit />
    </Loader>
  )
}

export default EditGroupPage
