import { useCallback, useState } from 'react'
import { Attendance, AttendanceNew } from '../types/attendance'
import { makeOrgCollection } from '../api/firebase/collections'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'

export function useAttendancesStore() {
  const [loading, setLoading] = useState(false)
  const [attendancesById, setAttendancesById] = useState<Dictionary<Attendance | undefined>>({})
  const attendances = useDictionaryToArray(attendancesById)

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
    fetchAttendance: useCallback(async (orgId: string, id: string) => {
      setLoading(true)
      const collection = makeOrgCollection<Attendance>('attendance', orgId)
      const resp = await collection.getById(id)
      setAttendancesById((state) => ({ ...state, [resp.id]: resp }))
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
    saveAttendance: useCallback(async (orgId: string, attendance: AttendanceNew | Attendance) => {
      setLoading(true)
      const groupsCollection = makeOrgCollection<Attendance>('attendances', orgId)
      await groupsCollection.save(attendance)
      setLoading(false)
    }, []),
    removeAttendances: useCallback(async (orgId: string, id: string[]) => {}, []),
    clearAttendances: useCallback(() => {
      setAttendancesById({})
    }, []),
  }
}
