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
    fetchAllAttendances: useCallback(async (orgId: string) => {
      if (isFetched) {
        return
      }
      try {
        setLoading(true)
        const collection = makeOrgCollection<Attendance>('attendances', orgId)
        const resp = await collection.getAll()
        const itemsById = arrayToDictionary(resp)
        setAttendancesById((att) => ({ ...att, ...itemsById }))
        isFetched = true
        setLoading(false)
      } catch (error) {
        setLoading(false)
        throw error
      }
    }, []),
    fetchAttendancesByDate: useCallback(async (orgId: string, from: Date, to: Date) => {
      try {
        setLoading(true)
        const collection = makeOrgCollection<Attendance>('attendances', orgId)
        const request = collection.queryMulti([
          ['date', '>=', from.getTime()],
          ['date', '<=', to.getTime()],
        ])
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
    fetchAttendancesForGroups: useCallback(async (orgId: string, groupsIds: string[]) => {
      // TODO: optimize this
      if (isFetched) {
        return
      }
      setLoading(true)
      const collection = makeOrgCollection<Attendance>('attendances', orgId)
      const resp = await collection.getAll()
      const itemsById = arrayToDictionary(resp)
      setAttendancesById((att) => ({ ...att, ...itemsById }))
      isFetched = true
      setLoading(false)
    }, []),
    saveAttendance: useCallback(async (orgId: string, attendance: AttendanceNew | Attendance) => {
      setLoading(true)
      const collection = makeOrgCollection<Attendance>('attendances', orgId)
      if ('id' in attendance) {
        const newRecord = await collection.save({ ...attendance, id: attendance.id }, { merge: false })
        setAttendancesById((att) => {
          att[newRecord.id] = newRecord
          return att
        })
      } else {
        const newRecord = await collection.save({ ...attendance, id: nanoid() }, { merge: false })
        setAttendancesById((att) => {
          att[newRecord.id] = newRecord
          return att
        })
      }
      setLoading(false)
    }, []),
    removeAttendance: useCallback(async (orgId: string, id: string) => {
      setLoading(true)
      const collection = makeOrgCollection<Attendance>('attendances', orgId)
      await collection.delete(id)
      setAttendancesById((att) => {
        delete att[id]
        return att
      })
      setLoading(false)
    }, []),
    clearAttendances: useCallback(() => {
      // We are trying to optimize requests to the firebase so disable cleaning
      // setAttendancesById({})
    }, []),
  }
}

// We use a lot of attendance data,
// to optimize reading from Firebase, we going to fetch it only once
let isFetched = false
