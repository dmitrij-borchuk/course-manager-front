import { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Attendance, AttendanceNew } from '../types/attendance'
import { makeOrgCollection } from '../api/firebase/collections'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { arrayToDictionary } from '../utils/common'
import { nanoid } from 'nanoid'
import { fetchAttendances, fetchAttendancesForGroups } from 'modules/attendance/api'

// TODO: add cache layer
export function useAttendancesStore() {
  const [loading, setLoading] = useState(false)
  const [attendancesById, setAttendancesById] = useState<Dictionary<Attendance | undefined>>({})
  const attendancesRaw = useDictionaryToArray<Attendance>(attendancesById as Dictionary<Attendance>)
  const attendances = useMemo(() => sortAttendances(attendancesRaw, true), [attendancesRaw])

  return {
    loading,
    attendancesById,
    attendances,
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
    fetchAttendances: useCallback(
      async (orgId: string, params: { teacherId?: string; activity?: string; from?: Date; to?: Date }) => {
        try {
          setLoading(true)
          const resp = await fetchAttendances(orgId, params)
          const itemsById = arrayToDictionary(resp)
          setAttendancesById((att) => ({ ...att, ...itemsById }))
          setLoading(false)
        } catch (error) {
          setLoading(false)
          throw error
        }
      },
      []
    ),
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

function sortAttendances(attendances: Attendance[], reverse = false) {
  return attendances.sort((a, b) => {
    if (a.date > b.date) {
      return reverse ? -1 : 1
    } else if (a.date < b.date) {
      return reverse ? 1 : -1
    } else {
      return 0
    }
  })
}

export function useAttendancesForGroups(orgId: string, groupsOuterIds: string[]) {
  return useQuery(['attendances', orgId, ...groupsOuterIds], () => fetchAttendancesForGroups(orgId, groupsOuterIds), {
    refetchOnWindowFocus: false,
  })
}
