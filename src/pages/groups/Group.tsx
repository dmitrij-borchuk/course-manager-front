import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Group } from '../../components/groups/Group'
import { useGroupsState } from '../../store'

export const GroupPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchGroup, groupsById, deleteGroup } = useGroupsState()
  const group = groupsById[id]
  const onDelete = useCallback(() => deleteGroup(id), [deleteGroup, id])

  useEffect(() => {
    fetchGroup(id)
  }, [fetchGroup, id])

  if (!group) {
    // Loading when edit schedule and return back
    return <div>Loading</div>
  }

  return <Group data={group} onDelete={onDelete} />
}

export default GroupPage
