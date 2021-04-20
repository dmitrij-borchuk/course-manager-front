import { useEffect } from 'react'
import { GroupsList } from '../../components/groups/GroupsList'
import { useGroupsState } from '../../store'

export const GroupsListPage = () => {
  const { fetchGroups, clearGroups, groups, loading } = useGroupsState()

  useEffect(() => {
    fetchGroups()

    return () => {
      clearGroups()
    }
  }, [clearGroups, fetchGroups])

  return <GroupsList items={groups} loading={loading} />
}

export default GroupsListPage
