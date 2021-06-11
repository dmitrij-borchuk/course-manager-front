import React, { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../../components/kit/header/Header'
import { Loader } from '../../components/kit/loader/Loader'
import { Teacher } from '../../components/teachers/Teacher'
import { useAttendancesState, useGroupsState, useTeachersState } from '../../store'
import { Dictionary } from '../../types/dictionary'
import { groupBy } from '../../utils/common'
import { getClassesDates } from '../../utils/schedule'

// TODO: Add loading skeleton
export const TeacherPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchTeacher, teachersById, fetching, deleteTeacher } = useTeachersState()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const { groups, fetchGroups } = useGroupsState()
  const teacher = teachersById[id]
  const onDelete = useCallback(() => deleteTeacher(id), [deleteTeacher, id])

  const attendancesByGroup = useMemo(() => groupBy(attendances, (a) => a.group?.id), [attendances])
  const classesByGroup = useMemo(
    () =>
      groups.reduce<Dictionary<Date[]>>((acc, g) => {
        return {
          ...acc,
          [g.id]: getClassesDates(g, new Date()),
        }
      }, {}),
    [groups]
  )
  const rateByGroup = useMemo(
    () =>
      (teacher?.groups || []).reduce<Dictionary<number>>((acc, g) => {
        const classesCount = classesByGroup[g.id]?.length || 0
        const groupRate = classesCount ? (attendancesByGroup[g.id]?.length || 0) / classesCount : 0

        return {
          ...acc,
          [g.id]: groupRate,
        }
      }, {}),
    [attendancesByGroup, classesByGroup, teacher?.groups]
  )

  useEffect(() => {
    fetchTeacher(id)
  }, [fetchTeacher, id])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useEffect(() => {
    if (teacher?.groups) {
      fetchAttendancesForGroups(teacher.groups.map((g) => g.id))

      return () => {
        clearAttendances()
      }
    }
  }, [clearAttendances, fetchAttendancesForGroups, teacher?.groups])

  // TODO: 404

  return (
    <>
      <Header />
      {/* TODO: skeleton loader */}
      <Loader show={fetching}>
        {teacher && <Teacher data={teacher} onDelete={onDelete} attendanceRates={rateByGroup} />}
      </Loader>
    </>
  )
}
