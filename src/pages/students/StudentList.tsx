import { useNotification } from 'hooks/useNotification'
import { useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { StudentList } from '../../components/students/StudentList'
import { TITLE_POSTFIX } from '../../config'
import { useAttendanceRateByStudent } from '../../hooks/useAttendanceRate'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendancesState, useStudentsState } from '../../store'

export const StudentListPage = () => {
  const { fetchStudents, students, fetching } = useStudentsState()
  const { attendances, clearAttendances, fetchAllAttendances } = useAttendancesState()
  const attendanceRate = useAttendanceRateByStudent(attendances)
  const orgKey = useOrgId()
  const fetchAttendance = useCallback(async () => {
    // TODO: it is pretty bad to fetch all attendances here
    // so we need to implement pagination or another solution
    // like caching attendances rates in the students records
    await fetchAllAttendances(orgKey)
  }, [fetchAllAttendances, orgKey])
  const { showError } = useNotification()

  useEffect(() => {
    fetchStudents().catch((error) => {
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('An unknown error occurred')
      }
    })
  }, [fetchStudents, showError])

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
