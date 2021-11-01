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
    fetchAllAttendances: useCallback(async (orgId: string, from?: Date, to?: Date) => {
      try {
        setLoading(true)
        const collection = makeOrgCollection<Attendance>('attendances', orgId)
        const request =
          from && to
            ? collection.queryMulti([
                ['date', '>=', from.getTime()],
                ['date', '<=', to.getTime()],
              ])
            : collection.getAll()
        const resp = await request
        const itemsById = arrayToDictionary(resp)
        setAttendancesById(itemsById)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        throw error
      }
    }, []),
    fetchAttendancesForTeacher: useCallback(async (orgId: string, teacherId: string, from: Date, to: Date) => {
      try {
        setLoading(true)
        const collection = makeOrgCollection<Attendance>('attendances', orgId)
        const resp = await collection.queryMulti([
          ['date', '>=', from.getTime()],
          ['date', '<=', to.getTime()],
          ['teacher', '==', teacherId],
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
    // TODO: do we need it?
    fetchAttendancesForStudent: useCallback(async (groupsIds: string[], studentId: string) => {
      // setLoading(true)
      // const response = await fetchAttendancesForStudent(groupsIds, studentId)
      // setAttendances(response.data)
      // setLoading(false)
    }, []),
    fetchAttendancesForGroups: useCallback(async (orgId: string, groupsIds: string[]) => {
      setLoading(true)
      const collection = makeOrgCollection<Attendance>('attendances', orgId)
      if (groupsIds.length) {
        const resp = await collection.getAll()
        const filtered = resp.filter((item) => groupsIds.includes(item.group))
        const itemsById = arrayToDictionary(filtered)
        setAttendancesById(itemsById)
      }
      setLoading(false)
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
