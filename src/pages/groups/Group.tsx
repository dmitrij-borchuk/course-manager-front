import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Group } from '../../components/groups/Group'
import { useGroupsState } from '../../store'

// TODO: Add loading skeleton
export const GroupPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchGroup, groupsById } = useGroupsState()
  const group = groupsById[id]

  useEffect(() => {
    fetchGroup(id)
  }, [fetchGroup, id])

  if (!group) {
    return <div>Loading</div>
  }

  return <Group data={group} />
}
