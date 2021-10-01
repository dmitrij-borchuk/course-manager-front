import { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import { nanoid } from 'nanoid'
import { makeOrgCollection } from '../api/firebase/collections'
import { ROUTES } from '../constants'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { Group, NewGroup } from '../types/group'
import { arrayToDictionary } from '../utils/common'

export default function useGroupsStore() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [groupsById, setGroupsById] = useState<Dictionary<Group>>({})
  const groups = useDictionaryToArray(groupsById)
  const [fetching, setFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchGroup = useCallback(async (orgId: string, id: string) => {
    setFetching(true)
    const groupsCollection = makeOrgCollection<Group>('groups', orgId)
    const resp = await groupsCollection.getById(id)
    setGroupsById((state) => ({ ...state, [resp.id]: resp }))
    setFetching(false)
  }, [])

  return {
    groups,
    groupsById,
    loading,
    submitting,
    fetching,

    fetchGroups: useCallback(async (orgId: string) => {
      setLoading(true)
      const groupsCollection = makeOrgCollection<Group>('groups', orgId)
      const resp = await groupsCollection.getAll()
      const newGroupsById = arrayToDictionary(resp)
      setGroupsById(newGroupsById)
      setLoading(false)
    }, []),
    fetchGroup,
    editGroup: useCallback(async (orgId: string, data: Partial<Group>) => {
      setSubmitting(true)
      const groupsCollection = makeOrgCollection<Group>('groups', orgId)
      try {
        const result = await groupsCollection.save(data)
        setGroupsById((state) => ({
          ...state,
          [result.id]: {
            ...state[result.id],
            ...data,
          },
        }))
        setSubmitting(false)
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }, []),
    createGroup: useCallback(
      async (orgId: string, data: NewGroup) => {
        setSubmitting(true)
        const groupsCollection = makeOrgCollection<Group>('groups', orgId)
        try {
          const result = await groupsCollection.save({ ...data, id: nanoid() })
          setGroupsById((state) => ({ ...state, [result.id]: { ...data, id: result.id } }))
          history.push(`/${orgId}${ROUTES.GROUPS_ROOT}/${result.id}`)
          setSubmitting(false)
        } catch (error) {
          setSubmitting(false)
          throw error
        }
      },
      [history]
    ),
    clearGroups: useCallback(() => {
      setGroupsById({})
      setLoading(false)
    }, []),
    deleteGroup: useCallback(
      async (orgId: string, id: string) => {
        setSubmitting(true)
        const groupsCollection = makeOrgCollection<Group>('groups', orgId)
        groupsCollection.delete(id)
        setGroupsById((state) => {
          delete state[id]
          return state
        })
        setSubmitting(false)
        history.push(`/${orgId}${ROUTES.GROUPS_LIST}`)
      },
      [history]
    ),
  }
}
