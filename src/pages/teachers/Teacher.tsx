import React, { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '../../components/kit/header/Header'
import { Loader } from '../../components/kit/loader/Loader'
import { Teacher } from '../../components/teachers/Teacher'
import { useAttendanceRateByGroups } from '../../hooks/useAttendanceRate'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendancesState, useGroupsState, useTeachersState } from '../../store'

// TODO: Add loading skeleton
export const TeacherPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchTeacher, teachersById, fetching, deleteTeacher } = useTeachersState()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const { groups, fetchGroupsOfTeacher, clearGroups } = useGroupsState()
  const teacher = teachersById[id]
  const orgId = useOrgId()
  const onDelete = useCallback(() => deleteTeacher(id), [deleteTeacher, id])
  const rateByGroup = useAttendanceRateByGroups(groups, attendances)
  const groupsOfTeacher = useMemo(() => groups.filter((g) => g.teacher === teacher?.id), [groups, teacher?.id])

  useEffect(() => {
    if (orgId) {
      fetchTeacher(orgId, id)
      // TODO: clear
    }
  }, [fetchTeacher, id, orgId])

  useEffect(() => {
    fetchGroupsOfTeacher(orgId, id)
    return () => {
      clearGroups()
    }
  }, [clearGroups, fetchGroupsOfTeacher, id, orgId])

  useEffect(() => {
    if (groupsOfTeacher.length) {
      // TODO: probably we need to fetch attendance only for ongoing groups
      fetchAttendancesForGroups(
        orgId,
        groupsOfTeacher.map((g) => g.id)
      )
      return () => {
        clearAttendances()
      }
    }
  }, [clearAttendances, fetchAttendancesForGroups, groupsOfTeacher, orgId])

  // TODO: 404

  return (
    <>
      <Header />
      {/* TODO: skeleton loader */}
      <Loader show={fetching}>
        {teacher && (
          <Teacher data={teacher} onDelete={onDelete} attendanceRates={rateByGroup} teachersGroups={groupsOfTeacher} />
        )}
      </Loader>
    </>
  )
}
