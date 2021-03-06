import { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import { ROUTES } from '../constants'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { createGroup, deleteGroup, editGroup, getGroup, getGroups } from '../services/groups'
import { Dictionary } from '../types/dictionary'
import { Group, GroupFull, NewGroup } from '../types/group'
import { arrayToDictionary } from '../utils/common'

export default function useGroupsStore() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [groupsById, setGroupsById] = useState<Dictionary<GroupFull>>({})
  const groups = useDictionaryToArray(groupsById)
  const [fetching, setFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchGroup = useCallback(async (id: string) => {
    setFetching(true)
    const resp = await getGroup(id)
    setGroupsById((state) => ({ ...state, [resp.data.id]: resp.data }))
    setFetching(false)
  }, [])

  return {
    groups,
    groupsById,
    loading,
    submitting,
    fetching,

    fetchGroups: useCallback(async (props?: Parameters<typeof getGroups>[0]) => {
      setLoading(true)
      const resp = await getGroups(props)
      const groupsById = arrayToDictionary(resp.data)
      setGroupsById(groupsById)
      setLoading(false)
    }, []),
    fetchGroup,
    editGroup: useCallback(
      async (data: Group) => {
        setSubmitting(true)
        const response = await editGroup(data)
        setGroupsById((state) => ({ ...state, [data.id]: response.data }))
        history.push(`${ROUTES.GROUPS_ROOT}/${data.id}`)
        setSubmitting(false)
      },
      [history]
    ),
    createGroup: useCallback(
      async (data: NewGroup) => {
        setSubmitting(true)
        const result = await createGroup(data)
        setGroupsById((state) => ({ ...state, [result.data.id]: result.data }))
        history.push(`${ROUTES.GROUPS_ROOT}/${result.data.id}`)
        setSubmitting(false)
      },
      [history]
    ),
    clearGroups: useCallback(() => {
      setGroupsById({})
      setLoading(false)
    }, []),
    deleteGroup: useCallback(
      async (id: string) => {
        setSubmitting(true)
        await deleteGroup(id)
        setGroupsById((state) => {
          delete state[id]
          return state
        })
        setSubmitting(false)
        history.push(ROUTES.GROUPS_LIST)
      },
      [history]
    ),
  }
}
