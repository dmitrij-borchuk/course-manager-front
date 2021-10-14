import { useCallback, useState } from 'react'
import { Attendance, AttendanceNew } from '../types/attendance'
import { makeOrgCollection } from '../api/firebase/collections'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { arrayToDictionary } from '../utils/common'

export function useAttendancesStore() {
  const [loading, setLoading] = useState(false)
  const [attendancesById, setAttendancesById] = useState<Dictionary<Attendance | undefined>>({})
  const attendances = useDictionaryToArray<Attendance>(attendancesById as Dictionary<Attendance>)

  return {
    loading,
    attendancesById,
    attendances,
    fetchAllAttendances: useCallback(async (orgId: string, from: Date, to: Date) => {
      try {
        setLoading(true)
        const collection = makeOrgCollection<Attendance>('attendances', orgId)
        const resp = await collection.queryMulti([
          ['date', '>=', from.getTime()],
          ['date', '<=', to.getTime()],
        ])
        const itemsById = arrayToDictionary(resp)
        setAttendancesById(itemsById)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        throw error
      }
    }, []),
    fetchAttendance: useCallback(async (orgId: string, id: string) => {
      setLoading(true)
      const collection = makeOrgCollection<Attendance>('attendances', orgId)
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
      await groupsCollection.save(attendance, { merge: false })
      setLoading(false)
    }, []),
    removeAttendances: useCallback(async (orgId: string, id: string[]) => {}, []),
    clearAttendances: useCallback(() => {
      setAttendancesById({})
    }, []),
  }
}
