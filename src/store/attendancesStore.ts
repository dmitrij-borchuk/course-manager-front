import { useCallback, useState } from 'react'
import { AttendanceFull } from '../types/attendance'
import { useDictionary } from '../hooks/useDictionary'
import { fetchAttendances } from '../services/attendances'

export function useAttendancesStore() {
  const [loading, setLoading] = useState(false)
  const [attendances, setAttendances] = useState<AttendanceFull[]>([])
  const groupsById = useDictionary(attendances)

  return {
    loading,
    groupsById,
    attendances,
    fetchAttendances: useCallback(async (from: Date, to: Date) => {
      setLoading(true)
      const response = await fetchAttendances(from, to)
      setAttendances(response.data)
      setLoading(false)
    }, []),
  }
}
