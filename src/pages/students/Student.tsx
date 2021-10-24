import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useGroupsState, useStudentsOfGroupState, useStudentsState } from '../../store'
import { useAttendancesState } from '../../store'
import { ROUTES } from '../../constants'
import { Student } from '../../components/students/Student'
import { useOrgId } from '../../hooks/useOrgId'
import { useStudentAttendanceRateByGroups } from '../../hooks/useAttendanceRate'

// TODO: Add loading skeleton
// TODO: Add 404 state
export const StudentPage = () => {
  const history = useHistory()
  let { id } = useParams<{ id: string }>()

  const { fetchStudent, studentsById, deleteStudent } = useStudentsState()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const { groups, fetchGroups, clearGroups } = useGroupsState()
  const {
    fetchGroupsOfStudent,
    clearGroupOfStudents,
    groupsOfStudent,
    fetching: fetchingGroups,
  } = useStudentsOfGroupState()
  const student = studentsById[id]
  const orgId = useOrgId()

  const onDelete = useCallback(async () => {
    await deleteStudent(orgId, id)
    history.push(`/${orgId}${ROUTES.STUDENTS_LIST}`)
  }, [deleteStudent, history, id, orgId])

  const rateByGroups = useStudentAttendanceRateByGroups(id, groups, attendances)

  useEffect(() => {
    fetchStudent(orgId, id)
  }, [fetchStudent, id, orgId])

  useEffect(() => {
    fetchGroups(orgId)
    return () => {
      clearGroups()
    }
  }, [clearGroups, fetchGroups, orgId])

  useEffect(() => {
    if (student?.id) {
      fetchGroupsOfStudent(orgId, [student.id], new Date())
      return () => clearGroupOfStudents()
    }
  }, [clearGroupOfStudents, fetchGroupsOfStudent, orgId, student?.id])

  useEffect(() => {
    if (groups.length) {
      // TODO: probably we need to fetch attendance only for ongoing groups
      fetchAttendancesForGroups(
        orgId,
        groups.map((g) => g.id)
      )
    }
  }, [clearAttendances, fetchAttendancesForGroups, groups, orgId])
  useEffect(() => {
    return () => {
      clearAttendances()
    }
  }, [clearAttendances])

  if (!student) {
    return <div>Loading</div>
  }

  return (
    <Student
      data={student}
      onDelete={onDelete}
      groups={groupsOfStudent}
      loadingGroups={fetchingGroups}
      attendanceRates={rateByGroups}
    />
  )
}

export default StudentPage
