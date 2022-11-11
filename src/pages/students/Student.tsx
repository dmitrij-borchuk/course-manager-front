import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useGroupsState, useStudentsOfGroupState, useStudentsState } from '../../store'
import { useAttendancesState } from '../../store'
import { ROUTES } from '../../constants'
import { Student } from '../../components/students/Student'
import { useOrgId } from '../../hooks/useOrgId'
import { useStudentAttendanceRateByGroups } from '../../hooks/useAttendanceRate'
import { TITLE_POSTFIX } from '../../config'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'

// TODO: Add 404 state
export const StudentPage = () => {
  const history = useHistory()
  let { id: idStr } = useParams<{ id: string }>()
  const id = parseInt(idStr)

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
  const orgKey = useOrgId()
  const organization = useCurrentOrg()

  const onDelete = useCallback(async () => {
    if (organization && student) {
      await deleteStudent(orgKey, organization.id, id, student.outerId)
      // TODO: Add notification
      history.push(`/${orgKey}${ROUTES.STUDENTS_LIST}`)
    }
  }, [deleteStudent, history, id, orgKey, organization, student])

  const rateByGroups = useStudentAttendanceRateByGroups(student?.outerId, groups, attendances)

  useEffect(() => {
    if (organization) {
      fetchStudent(organization.id, id)
    }
  }, [fetchStudent, id, organization])

  useEffect(() => {
    fetchGroups(orgKey)
    return () => {
      clearGroups()
    }
  }, [clearGroups, fetchGroups, orgKey])

  useEffect(() => {
    if (student?.outerId) {
      fetchGroupsOfStudent(orgKey, [student.outerId], new Date())
      return () => clearGroupOfStudents()
    }
  }, [clearGroupOfStudents, fetchGroupsOfStudent, orgKey, student?.outerId])

  useEffect(() => {
    if (groups.length) {
      // TODO: probably we need to fetch attendance only for ongoing groups
      fetchAttendancesForGroups(
        orgKey,
        groups.map((g) => g.id)
      )
    }
  }, [clearAttendances, fetchAttendancesForGroups, groups, orgKey])
  useEffect(() => {
    return () => {
      clearAttendances()
    }
  }, [clearAttendances])

  if (!student) {
    return <div>Loading</div>
  }

  return (
    <>
      <Helmet>
        <title>Student{TITLE_POSTFIX}</title>
      </Helmet>

      <Student
        data={student}
        onDelete={onDelete}
        groups={groupsOfStudent}
        loadingGroups={fetchingGroups}
        attendanceRates={rateByGroups}
      />
    </>
  )
}

export default StudentPage
