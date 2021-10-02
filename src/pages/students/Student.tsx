import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useGroupsState, useStudentsOfGroupState, useStudentsState } from '../../store'
import { useAttendancesState } from '../../store'
import { ROUTES } from '../../constants'
import { Student } from '../../components/students/Student'
import { useOrgId } from '../../hooks/useOrgId'

// TODO: Add loading skeleton
// TODO: Add 404 state
export const StudentPage = () => {
  const history = useHistory()
  let { id } = useParams<{ id: string }>()

  const { fetchStudent, studentsById, deleteStudent } = useStudentsState()
  const { /* attendances,  */ clearAttendances, fetchAttendancesForStudent } = useAttendancesState()
  const { /* groups,  */ fetchGroups } = useGroupsState()
  const {
    fetchGroupsOfStudent,
    clearGroupOfStudents,
    groupsOfStudent,
    fetching: fetchingGroups,
  } = useStudentsOfGroupState()
  const student = studentsById[id]
  const orgId = useOrgId()

  const onDelete = useCallback(async () => {
    await deleteStudent(id)
    history.push(ROUTES.STUDENTS_LIST)
  }, [deleteStudent, history, id])
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
  // const attendancesByGroup = useMemo(() => groupBy(attendances, (a) => a.group?.id), [attendances])
  // const rateByGroup = useMemo(
  //   () =>
  //     (student?.groups || []).reduce<Dictionary<number>>((acc, g) => {
  //       const classesCount = classesByGroup[g.id]?.length || 0
  //       const groupRate = classesCount ? (attendancesByGroup[g.id]?.length || 0) / classesCount : 0

  //       return {
  //         ...acc,
  //         [g.id]: groupRate,
  //       }
  //     }, {}),
  //   [attendancesByGroup, classesByGroup, student?.groups]
  // )

  useEffect(() => {
    fetchStudent(orgId, id)
  }, [fetchStudent, id, orgId])

  useEffect(() => {
    fetchGroups(orgId)
  }, [fetchGroups, orgId])

  useEffect(() => {
    if (student?.id) {
      fetchGroupsOfStudent(orgId, student.id)
      return () => clearGroupOfStudents()
    }
  }, [clearGroupOfStudents, fetchGroupsOfStudent, orgId, student?.id])

  useEffect(() => {
    if (student) {
      // fetchAttendancesForStudent(
      //   student.groups.map((g) => g.id),
      //   student.id
      // )
      return () => {
        clearAttendances()
      }
    }
  }, [clearAttendances, fetchAttendancesForStudent, student])

  if (!student) {
    return <div>Loading</div>
  }

  return (
    <Student
      data={student}
      onDelete={onDelete}
      attendanceRates={{}}
      groups={groupsOfStudent}
      loadingGroups={fetchingGroups}
    />
  )
}

export default StudentPage
