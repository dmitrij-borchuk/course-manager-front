import { useEffect } from 'react'
import { StudentList } from '../../components/students/StudentList'
import { useOrgId } from '../../hooks/useOrgId'
import { useStudentsState } from '../../store'

export const StudentListPage = () => {
  const { fetchStudents, students } = useStudentsState()
  const orgId = useOrgId()

  useEffect(() => {
    fetchStudents(orgId)
  }, [fetchStudents, orgId])

  return <StudentList items={students} />
}

export default StudentListPage
