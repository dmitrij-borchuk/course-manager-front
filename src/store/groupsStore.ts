import { useCallback, useState } from 'react'
import { deleteActivity, editActivity, fetchActivities, fetchActivity } from '../api/activities'
import { Activity } from '../types/activity'

// TODO: remove?
export default function useGroupsStore() {
  const [groupsById, setGroupsById] = useState<Map<number, Activity>>(new Map())
  const groups = Array.from(groupsById.values())
  const [fetching, setFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchGroup = useCallback(async (id: number) => {
    setFetching(true)
    const resp = await fetchActivity(id)
    setGroupsById((state) => {
      state.set(resp.data.id, resp.data)
      return state
    })
    setFetching(false)
  }, [])

  return {
    groups,
    groupsById,
    submitting,
    fetching,

    fetchGroups: useCallback(async () => {
      try {
        setFetching(true)
        const resp = await fetchActivities()
        setGroupsById(new Map(resp.data.map((group) => [group.id, group])))
        setFetching(false)
      } catch (error) {
        setFetching(false)
        throw error
      }
    }, []),
    fetchGroupsOfTeacher: useCallback(async (teacherId: number) => {
      try {
        setFetching(true)
        const resp = await fetchActivities({
          performerId: teacherId,
        })
        setGroupsById(new Map(resp.data.map((group) => [group.id, group])))
        setFetching(false)
      } catch (error) {
        setFetching(false)
        throw error
      }
    }, []),
    fetchGroup,
    editGroup: useCallback(async (id: number, data: Partial<Activity>) => {
      setSubmitting(true)
      try {
        const result = await editActivity(id, data)
        setGroupsById((state) => {
          state.set(result.data.id, result.data)
          return state
        })
        setSubmitting(false)
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }, []),
    clearGroups: useCallback(() => {
      setGroupsById(new Map())
      setFetching(false)
    }, []),
    deleteGroup: useCallback(async (id: number) => {
      setSubmitting(true)

      // const groupsCollection = makeOrgCollection<Group>('groups', orgId)
      await deleteActivity(id)
      setGroupsById((state) => {
        state.delete(id)
        return state
      })
      setSubmitting(false)
    }, []),
  }
}
