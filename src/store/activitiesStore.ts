import { useCallback, useState } from 'react'
import { Activity, NewActivity } from '../types/activity'
import { createActivity, migrateActivities } from '../api/activities'

export type InitialActivitiesState = {
  list?: Map<number, Activity>
}
export default function useActivitiesStore(initial: InitialActivitiesState = {}) {
  const [submittingSemaphore, setSubmittingSemaphore] = useState(0)
  const [activitiesById, setActivitiesById] = useState<Map<number, Activity>>(new Map(initial.list))

  return {
    activitiesById,
    submitting: submittingSemaphore > 0,
    migrate: useCallback(async () => {
      try {
        setSubmittingSemaphore((v) => v + 1)
        const result = await migrateActivities()
        setSubmittingSemaphore((v) => v - 1)
        return result
      } catch (error) {
        setSubmittingSemaphore((v) => v - 1)
        throw error
      }
    }, []),
    createActivity: useCallback(async (data: NewActivity) => {
      setSubmittingSemaphore((v) => v + 1)

      try {
        const response = await createActivity(data)
        const result = response.data
        setActivitiesById((state) => new Map(state).set(result.id, result))
        setSubmittingSemaphore((v) => v - 1)
        return result
      } catch (error) {
        setSubmittingSemaphore((v) => v - 1)
        throw error
      }
    }, []),
  }
}
