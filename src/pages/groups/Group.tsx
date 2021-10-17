import { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
// import { getClassesDates } from '../../utils/schedule'
import { useAttendancesState, useGroupsState, useStudentsOfGroupState, useTeachersState } from '../../store'
import { Group } from '../../components/groups/Group'
import { useOrgId } from '../../hooks/useOrgId'

export const GroupPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchGroup, groupsById, deleteGroup } = useGroupsState()
  const { fetchTeacher, teachersById } = useTeachersState()
  const {
    fetchStudentsOfGroup,
    clearStudentsOfGroup,
    studentsOfGroup,
    fetching: loadingGroups,
  } = useStudentsOfGroupState()
  const { /* attendances,  */ clearAttendances, fetchAttendancesForGroup } = useAttendancesState()
  const group = groupsById[id]
  const teacher = teachersById[group?.teacher || '']
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
  // const classes = useMemo(() => (group ? getClassesDates(group, new Date()) : []), [group])
  // const attendancesByStudent = useMemo(() => groupBy(attendances, (a) => a.student?.id), [attendances])
  const rateByStudent = {}
  // const rateByStudent = useMemo(
  //   () =>
  //     (group?.students || []).reduce<Dictionary<number>>((acc, s) => {
  //       const classesCount = classes.length

  //       if (!attendancesByStudent[s.id]) {
  //         return acc
  //       }
  //       const rate = classesCount ? attendancesByStudent[s.id].length / classesCount : 0

  //       return {
  //         ...acc,
  //         [s.id]: rate,
  //       }
  //     }, {}),
  //   [attendancesByStudent, classes.length, group?.students]
  // )

  useEffect(() => {
    fetchGroup(orgId, id)
  }, [fetchGroup, id, orgId])

  useEffect(() => {
    if (group?.teacher && !teacher) {
      fetchTeacher(orgId, group.teacher)
    }
  }, [fetchTeacher, group?.teacher, orgId, teacher])

  useEffect(() => {
    if (group?.id) {
      fetchStudentsOfGroup(orgId, group.id, new Date())
      return () => clearStudentsOfGroup()
    }
  }, [clearStudentsOfGroup, fetchStudentsOfGroup, group?.id, orgId])

  useEffect(() => {
    if (group) {
      fetchAttendancesForGroup(group.id)
      return () => {
        clearAttendances()
      }
    }
  }, [clearAttendances, fetchAttendancesForGroup, group])

  if (!groupFull) {
    // Loading when edit schedule and return back
    return <div>Loading</div>
  }

  return (
    <Group
      data={groupFull}
      onDelete={onDelete}
      attendanceRates={rateByStudent}
      studentsOfGroup={studentsOfGroup}
      loadingGroups={loadingGroups}
    />
  )
}

export default GroupPage
