import React, { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../../components/kit/header/Header'
import { Loader } from '../../components/kit/loader/Loader'
import { Teacher } from '../../components/teachers/Teacher'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendancesState, useGroupsState, useTeachersState } from '../../store'

// TODO: Add loading skeleton
export const TeacherPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchTeacher, teachersById, fetching, deleteTeacher } = useTeachersState()
  const { clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const { groups, fetchGroups } = useGroupsState()
  const teacher = teachersById[id]
  const orgId = useOrgId()
  // const { appUser } = useAuthState()
  const onDelete = useCallback(() => deleteTeacher(id), [deleteTeacher, id])

  // const attendancesByGroup = useMemo(() => groupBy(attendances, (a) => a.group?.id), [attendances])
  // const classesByGroup = useMemo(
  //   () =>
  //     groups.reduce<Dictionary<Date[]>>((acc, g) => {
  //       return {
  //         ...acc,
  //         [g.id]: getClassesDates(g, new Date()),
  //       }
  //     }, {}),
  //   [groups]
  // )
  const groupsOfTeacher = useMemo(() => groups.filter((g) => g.teacher === teacher?.id), [groups, teacher?.id])
  // const rateByGroup = useMemo(() => {
  //   return groupsOfTeacher.reduce<Dictionary<number>>((acc, g) => {
  //     const classesCount = classesByGroup[g.id]?.length || 0
  //     const groupRate = classesCount ? (attendancesByGroup[g.id]?.length || 0) / classesCount : 0

  //     return {
  //       ...acc,
  //       [g.id]: groupRate,
  //     }
  //   }, {})
  // }, [attendancesByGroup, classesByGroup, groupsOfTeacher])

  useEffect(() => {
    if (orgId) {
      fetchTeacher(orgId, id)
      // TODO: clear
    }
  }, [fetchTeacher, id, orgId])

  useEffect(() => {
    // TODO: probably we need only groups of teacher
    fetchGroups(orgId)
    // TODO: clear
  }, [fetchGroups, orgId])

  useEffect(() => {
    fetchAttendancesForGroups(
      orgId,
      groupsOfTeacher.map((g) => g.id)
    )

    return () => {
      clearAttendances()
    }
  }, [clearAttendances, fetchAttendancesForGroups, groupsOfTeacher, orgId])

  // TODO: 404

  return (
    <>
      <Header />
      {/* TODO: skeleton loader */}
      <Loader show={fetching}>
        {teacher && (
          <Teacher data={teacher} onDelete={onDelete} attendanceRates={{}} teachersGroups={groupsOfTeacher} />
        )}
      </Loader>
    </>
  )
}
