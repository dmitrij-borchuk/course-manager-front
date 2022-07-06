import { useCallback, useState } from 'react'
import { Attendance, AttendanceNew } from '../types/attendance'
import { makeOrgCollection } from '../api/firebase/collections'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { arrayToDictionary } from '../utils/common'
import { nanoid } from 'nanoid'

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
        setAttendancesById((att) => ({ ...att, ...itemsById }))
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
        setAttendancesById((att) => ({ ...att, ...itemsById }))
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
      if ('id' in attendance) {
        await groupsCollection.save({ ...attendance, id: attendance.id }, { merge: false })
      } else {
        await groupsCollection.save({ ...attendance, id: nanoid() }, { merge: false })
      }
      setLoading(false)
    }, []),
    removeAttendance: useCallback(async (orgId: string, id: string) => {
      setLoading(true)
      const groupsCollection = makeOrgCollection<Attendance>('attendances', orgId)
      await groupsCollection.delete(id)
      setAttendancesById((att) => {
        delete att[id]
        return att
      })
      setLoading(false)
    }, []),
    clearAttendances: useCallback(() => {
      setAttendancesById({})
    }, []),
  }
}
