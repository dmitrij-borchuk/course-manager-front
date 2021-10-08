import { useCallback, useState } from 'react'
import { AttendanceFull, AttendanceNew } from '../types/attendance'
import { useDictionary } from '../hooks/useDictionary'
// import {
//   addAttendances,
//   fetchAttendances,
//   fetchAttendancesForStudent,
//   removeAttendances,
// } from '../services/attendances'

export function useAttendancesStore() {
  const [loading, setLoading] = useState(false)
  const [attendances, setAttendances] = useState<AttendanceFull[]>([])
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
    addAttendances: useCallback(async (attendances: AttendanceNew[]) => {
      // setLoading(true)
      // await addAttendances(attendances)
      // setLoading(false)
    }, []),
    removeAttendances: useCallback(async (id: string[]) => {
      // setLoading(true)
      // await removeAttendances(id)
      // setLoading(false)
    }, []),
    clearAttendances: useCallback(() => {
      setAttendances([])
    }, []),
  }
}
