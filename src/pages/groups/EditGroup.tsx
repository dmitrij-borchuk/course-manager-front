import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { EditGroup, GroupForm } from '../../components/groups/EditGroup'
import { Loader } from '../../components/kit/loader/Loader'
import { useGroupsState } from '../../store'

export const EditGroupPage = () => {
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
        ...data,
      })
    },
    [editGroup, group]
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
