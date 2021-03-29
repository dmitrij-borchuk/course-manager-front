import { useEffect } from 'react'
import { StudentList } from '../../components/students/StudentList'
import { useStudentsState } from '../../store'

export const StudentListPage = () => {
  const { fetchStudents, students } = useStudentsState()

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  return <StudentList items={students} />
}
