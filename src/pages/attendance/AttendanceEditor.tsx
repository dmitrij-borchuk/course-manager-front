import React, { useCallback, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useAttendancesState, useGroupsState } from '../../store'
import { datesAreOnSameDay } from '../../utils/date'
import { Student } from '../../types/student'
import AttendanceEditor from '../../components/attendance/AttendanceEditor'

export const AttendanceEditorPage = () => {
  const { id, date } = useParams<{ id: string; date: string }>()
  const { fetchGroup, groupsById } = useGroupsState()
  const history = useHistory()
  const {
    addAttendances,
    removeAttendances,
    fetchAttendancesForGroup,
    clearAttendances,
    attendances,
    loading: attendancesLoading,
  } = useAttendancesState()
  // TODO: add 404
  const group = groupsById[id]
  const dateObj = useMemo(() => new Date(date), [date])
  const onSubmit = useCallback(
    async ({ toAdd, toRemove }: { toAdd: Student[]; toRemove: Student[] }) => {
      // TODO: add loading
      await addAttendances(
        toAdd.map((s) => ({
          date,
          group: group.id,
          student: s.id,
        }))
      )
      const attendancesIdsMaybe = toRemove.map(
        (s) => attendances.find((a) => datesAreOnSameDay(new Date(a.date), dateObj) && a.student?.id === s.id)?.id
      )
      const attendancesIds = attendancesIdsMaybe.filter(Boolean) as string[]
      await removeAttendances(attendancesIds)
      history.push(`/`)
    },
    [addAttendances, attendances, date, dateObj, group.id, history, removeAttendances]
  )

  useEffect(() => {
    fetchGroup(id)
  }, [fetchGroup, id])

  useEffect(() => {
    if (group?.id) {
      fetchAttendancesForGroup(group.id)
      return () => clearAttendances()
    }
  }, [clearAttendances, fetchAttendancesForGroup, group?.id])

  if (!group || attendancesLoading) {
    // TODO
    return <div>Loading</div>
  }

  return <AttendanceEditor group={group} date={dateObj} onSubmit={onSubmit} attendances={attendances} />
}

export default AttendanceEditorPage
