import { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useAttendancesState, useGroupsState, useStudentsOfGroupState, useTeachersState } from '../../store'
import { Group } from '../../components/groups/Group'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendanceRateByStudent } from '../../hooks/useAttendanceRate'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { TITLE_POSTFIX } from '../../config'

export const GroupPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchGroup, groupsById, deleteGroup } = useGroupsState()
  const { fetchTeacherByOuterId, teachersByOuterId } = useTeachersState()
  const {
    fetchStudentsOfGroup,
    clearStudentsOfGroup,
    studentsOfGroup,
    fetching: loadingGroups,
  } = useStudentsOfGroupState()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const group = groupsById[id]
  const teacher = teachersByOuterId[group?.teacher || '']
  const groupFull = useMemo(() => {
    if (!group || (group?.teacher && !teacher)) {
      return undefined
    }

    return {
      ...group,
      teacher,
    }
  }, [group, teacher])
  const orgId = useOrgId()
  const onDelete = useCallback(() => deleteGroup(orgId, id), [deleteGroup, id, orgId])
  const attendancesOfGroup = useMemo(() => {
    return attendances.filter((a) => a.group === id)
  }, [attendances, id])
  const attendanceRate = useAttendanceRateByStudent(attendancesOfGroup)

  useEffect(() => {
    fetchGroup(orgId, id)
  }, [fetchGroup, id, orgId])

  const org = useCurrentOrg()
  useEffect(() => {
    if (group?.teacher && !teacher && org?.id) {
      fetchTeacherByOuterId(org.id, group.teacher)
    }
  }, [fetchTeacherByOuterId, group?.teacher, org?.id, teacher])

  useEffect(() => {
    if (group?.id) {
      fetchStudentsOfGroup(orgId, group.id, new Date())
      return () => clearStudentsOfGroup()
    }
  }, [clearStudentsOfGroup, fetchStudentsOfGroup, group?.id, orgId])

  useEffect(() => {
    if (group) {
      fetchAttendancesForGroups(orgId, [group.id])
      return () => {
        clearAttendances()
      }
    }
  }, [clearAttendances, fetchAttendancesForGroups, group, orgId])

  if (!groupFull) {
    // Loading when edit schedule and return back
    return <div>Loading</div>
  }

  return (
    <>
      <Helmet>
        <title>Group{TITLE_POSTFIX}</title>
      </Helmet>
      <Group
        data={groupFull}
        onDelete={onDelete}
        attendanceRates={attendanceRate}
        studentsOfGroup={studentsOfGroup}
        loadingGroups={loadingGroups}
      />
    </>
  )
}

export default GroupPage
