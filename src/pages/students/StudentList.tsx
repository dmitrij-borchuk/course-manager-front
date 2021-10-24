import { useCallback, useEffect } from 'react'
import { StudentList } from '../../components/students/StudentList'
import { useAttendanceRateByStudent } from '../../hooks/useAttendanceRate'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendancesState, useStudentsState } from '../../store'
import useStudentsOfGroupStore from '../../store/studentsOfGroupStore'

export const StudentListPage = () => {
  const { fetchStudents, students } = useStudentsState()
  const { fetchGroupsOfStudent } = useStudentsOfGroupStore()
  const { attendances, clearAttendances, fetchAttendancesForGroups } = useAttendancesState()
  const attendanceRate = useAttendanceRateByStudent(attendances)
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
    fetchStudents(orgId)
  }, [fetchStudents, orgId])

  useEffect(() => {
    if (students.length === 0) {
      return
    }
    fetchAttendance()
    return () => {
      clearAttendances()
    }
  }, [clearAttendances, fetchAttendance, students.length])

  return <StudentList items={students} attendanceRates={attendanceRate} />
}

export default StudentListPage
