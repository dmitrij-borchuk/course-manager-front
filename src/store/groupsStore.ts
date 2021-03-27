import { useCallback, useState } from 'react'
import { useDictionary } from '../hooks/useDictionary'
import { getGroups } from '../services/groups'
import { Group } from '../types/group'

export default function useGroupsStore() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const groupsById = useDictionary(groups)

  return {
    groups,
    groupsById,
    loading,
    fetchGroups: useCallback(async (id: string) => {
      setLoading(true)
      const resp = await getGroups()
      setGroups(resp.data)
      setLoading(false)
    }, []),
  }
}
