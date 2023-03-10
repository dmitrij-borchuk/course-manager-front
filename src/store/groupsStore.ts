import { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import {
  deleteActivity,
  editActivity,
  fetchActivities,
  fetchActivity,
  fetchParticipation,
} from '../modules/activities/api'
import { Activity } from '../types/activity'

// TODO: remove?
export default function useGroupsStore() {
  const [groupsById, setGroupsById] = useState<Map<number, Activity>>(new Map())
  const groups = useMemo(() => Array.from(groupsById.values()), [groupsById])
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

    fetchGroups: useCallback(async (params?: Parameters<typeof fetchActivities>[0]) => {
      try {
        setFetching(true)
        const resp = await fetchActivities(params)
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
    closeGroup: useCallback(async (id: number) => {
      setSubmitting(true)

      const result = await editActivity(id, {
        archived: true,
      })
      setGroupsById((state) => {
        state.set(result.data.id, result.data)
        return state
      })
      setSubmitting(false)
    }, []),
  }
}

export function useGroups(params: Parameters<typeof fetchActivities>[0] = {}) {
  return useQuery(['groups', params], () => fetchActivities(params))
}
export function useParticipation(params: Parameters<typeof fetchParticipation>[0] = {}) {
  return useQuery(['participation', params], () => fetchParticipation(params), {
    refetchOnWindowFocus: false,
  })
}
