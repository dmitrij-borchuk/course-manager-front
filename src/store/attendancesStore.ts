import { useCallback, useState } from 'react'
import { AttendanceFull } from '../types/attendance'
import { useDictionary } from '../hooks/useDictionary'
import { fetchAttendances, fetchAttendancesForStudent } from '../services/attendances'

export function useAttendancesStore() {
  const [loading, setLoading] = useState(false)
  const [attendances, setAttendances] = useState<AttendanceFull[]>([])
  const attendancesById = useDictionary(attendances)

  return {
    loading,
    attendancesById,
    attendances,
    fetchAttendances: useCallback(async (from: Date, to: Date) => {
      setLoading(true)
      const response = await fetchAttendances(from, to)
      setAttendances(response.data)
      setLoading(false)
    }, []),
    fetchAttendancesForStudent: useCallback(async (groupsIds: string[], studentId: string) => {
      setLoading(true)
      const response = await fetchAttendancesForStudent(groupsIds, studentId)
      setAttendances(response.data)
      setLoading(false)
    }, []),
    clearAttendances: useCallback(() => {
      setAttendances([])
    }, []),
  }
}
