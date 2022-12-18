import { useCallback, useState } from 'react'
import { Dictionary } from '../types/dictionary'
import { Activity } from '../types/activity'
import { migrateActivities } from '../api/activities'

export type InitialActivitiesState = {
  list?: Dictionary<Activity>
}
export default function useActivitiesStore(initial: InitialActivitiesState = {}) {
  const [submittingSemaphore, setSubmittingSemaphore] = useState(0)

  return {
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
  }
}
