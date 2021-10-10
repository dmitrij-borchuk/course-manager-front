import { useCallback, useState } from 'react'
import { Attendance, AttendanceNew } from '../types/attendance'
import { useDictionary } from '../hooks/useDictionary'
import { makeOrgCollection } from '../api/firebase/collections'

export function useAttendancesStore() {
  const [loading, setLoading] = useState(false)
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const attendancesById = useDictionary(attendances)

  return {
    loading,
    attendancesById,
    attendances,
    fetchAllAttendances: useCallback(async (from: Date, to: Date) => {
      setLoading(true)
      // TODO: implement
      // const response = await fetchAllAttendances(from, to)
      // setAttendances(response.data)
      setLoading(false)
    }, []),
    fetchAttendancesForStudent: useCallback(async (groupsIds: string[], studentId: string) => {
      // setLoading(true)
      // const response = await fetchAttendancesForStudent(groupsIds, studentId)
      // setAttendances(response.data)
      // setLoading(false)
    }, []),
    fetchAttendancesForGroup: useCallback(async (groupId: string) => {
      // setLoading(true)
      // const response = await fetchAttendances([groupId], [])
      // setAttendances(response.data)
      // setLoading(false)
    }, []),
    fetchAttendancesForGroups: useCallback(async (groupsIds: string[]) => {
      // setLoading(true)
      // const response = await fetchAttendances(groupsIds, [])
      // setAttendances(response.data)
      // setLoading(false)
    }, []),
    addAttendance: useCallback(async (orgId: string, attendance: AttendanceNew | Attendance) => {
      setLoading(true)
      const groupsCollection = makeOrgCollection<Attendance>('attendances', orgId)
      await groupsCollection.save(attendance)
      setLoading(false)
    }, []),
    removeAttendances: useCallback(async (orgId: string, id: string[]) => {}, []),
    clearAttendances: useCallback(() => {
      setAttendances([])
    }, []),
  }
}
