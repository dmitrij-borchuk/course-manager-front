import { useNotification } from 'hooks/useNotification'
import { useQuery } from 'hooks/useQuery'
import { useEffect, useMemo } from 'react'
import { useAttendancesForGroups } from 'store/attendancesStore'
import { useGroups } from 'store/groupsStore'
import { StudentList } from '../../components/students/StudentList'
import { useAttendanceRateByStudent } from '../../hooks/useAttendanceRate'
import { useStudentsState } from '../../store'

export const StudentListPage = () => {
  const { fetchStudents, students, fetching } = useStudentsState()
  const query = useQuery()
  const filter = query.get('filter') ?? ''
  // TODO: need to add pagination and filtering,
  // but it's not implemented on the backend yet
  const groupsQuery = useGroups({
    archived: 'false',
  })
  const groups = groupsQuery.data?.data
  const groupsIds = useMemo(() => groups?.map((g) => g.outerId) || [], [groups])
  const attendanceQuery = useAttendancesForGroups(groupsIds)
  const attendances = useMemo(() => attendanceQuery.data || [], [attendanceQuery.data])
  const attendanceRate = useAttendanceRateByStudent(attendances)
  const { showError } = useNotification()

  useEffect(() => {
    fetchStudents(filter).catch((error) => {
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('An unknown error occurred')
      }
    })
  }, [fetchStudents, filter, showError])

  return (
    <>
      <StudentList items={students} attendanceRates={attendanceRate} loading={fetching} />
    </>
  )
}

export default StudentListPage
