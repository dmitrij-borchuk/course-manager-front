import { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Dictionary } from '../../types/dictionary'
import { groupBy } from '../../utils/common'
import { getClassesDates } from '../../utils/schedule'
import { useAttendancesState, useGroupsState, useTeachersState } from '../../store'
import { Group } from '../../components/groups/Group'
import { useOrgId } from '../../hooks/useOrgId'

export const GroupPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchGroup, groupsById, deleteGroup } = useGroupsState()
  const { fetchTeacher, teachersById } = useTeachersState()
  const { attendances, clearAttendances, fetchAttendancesForGroup } = useAttendancesState()
  const group = groupsById[id]
  const teacher = teachersById[group?.teacher || '']
  const groupWithTeacher = useMemo(() => {
    if (!group || (group?.teacher && !teacher)) {
      return undefined
    }

    return {
      ...group,
      teacher,
    }
  }, [group, teacher])
  const orgId = useOrgId()
  const onDelete = useCallback(() => deleteGroup(id), [deleteGroup, id])
  const classes = useMemo(() => (group ? getClassesDates(group, new Date()) : []), [group])
  const attendancesByStudent = useMemo(() => groupBy(attendances, (a) => a.student?.id), [attendances])
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
    if (group) {
      fetchAttendancesForGroup(group.id)
      return () => {
        clearAttendances()
      }
    }
  }, [clearAttendances, fetchAttendancesForGroup, group])

  if (!groupWithTeacher) {
    // Loading when edit schedule and return back
    return <div>Loading</div>
  }

  return <Group data={groupWithTeacher} onDelete={onDelete} attendanceRates={rateByStudent} />
}

export default GroupPage
