import { StudentList } from '../../components/students/StudentList'
import { useStudents } from '../../hooks/useStudents'

export const StudentListPage = () => {
  const { data, loading } = useStudents()

  return <StudentList items={data?.students || undefined} />
}
