import { useEffect } from 'react'
import { GroupsList } from '../../components/groups/GroupsList'
import { useOrgId } from '../../hooks/useOrgId'
import { useGroupsState } from '../../store'

export const GroupsListPage = () => {
  const { fetchGroups, clearGroups, groups, loading } = useGroupsState()
  const orgId = useOrgId()

  useEffect(() => {
    if (orgId) {
      fetchGroups(orgId)
      return () => {
        clearGroups()
      }
    }
  }, [clearGroups, fetchGroups, orgId])

  return <GroupsList items={groups} loading={loading} />
}

export default GroupsListPage
