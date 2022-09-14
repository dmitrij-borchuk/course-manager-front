import { useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { StudentList } from '../../components/students/StudentList'
import { TITLE_POSTFIX } from '../../config'
import { useAttendanceRateByStudent } from '../../hooks/useAttendanceRate'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendancesState, useStudentsState } from '../../store'
import useStudentsOfGroupStore from '../../store/studentsOfGroupStore'

export const StudentListPage = () => {
  const { fetchStudents, students, fetching } = useStudentsState()
  const { fetchGroupsOfStudent } = useStudentsOfGroupStore()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const attendanceRate = useAttendanceRateByStudent(attendances)
  const org = useCurrentOrg()
  const orgId = useOrgId()
  const fetchAttendance = useCallback(async () => {
    const groups = await fetchGroupsOfStudent(
      orgId,
      students.map((s) => s.id),
      new Date()
    )
    await fetchAttendancesForGroups(
      orgId,
      groups.map((g) => g.id)
    )
  }, [fetchAttendancesForGroups, fetchGroupsOfStudent, orgId, students])

  useEffect(() => {
    if (org?.id) {
      fetchStudents(org.id)
    }
  }, [fetchStudents, org?.id])

  useEffect(() => {
    if (students.length === 0) {
      return
    }
    fetchAttendance()
    return () => {
      clearAttendances()
    }
  }, [clearAttendances, fetchAttendance, students.length])

  return (
    <>
      <Helmet>
        <title>Students{TITLE_POSTFIX}</title>
      </Helmet>

      <StudentList items={students} attendanceRates={attendanceRate} loading={fetching} />
    </>
  )
}

export default StudentListPage
