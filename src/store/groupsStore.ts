import { useCallback, useState } from 'react'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { getGroup, getGroups } from '../services/groups'
import { Dictionary } from '../types/dictionary'
import { GroupFull } from '../types/group'
import { arrayToDictionary } from '../utils/common'

export default function useGroupsStore() {
  const [loading, setLoading] = useState(false)
  const [groupsById, setGroupsById] = useState<Dictionary<GroupFull>>({})
  const groups = useDictionaryToArray(groupsById)

  return {
    groups,
    groupsById,
    loading,
    fetchGroups: useCallback(async (props?: Parameters<typeof getGroups>[0]) => {
      setLoading(true)
      const resp = await getGroups(props)
      const groupsById = arrayToDictionary(resp.data)
      setGroupsById(groupsById)
      setLoading(false)
    }, []),
    fetchGroup: useCallback(async (id: string) => {
      setLoading(true)
      const resp = await getGroup(id)
      setGroupsById((state) => ({ ...state, [resp.data.id]: resp.data }))
      setLoading(false)
    }, []),
    clearGroups: useCallback(() => {
      setGroupsById({})
      setLoading(false)
    }, []),
  }
}
