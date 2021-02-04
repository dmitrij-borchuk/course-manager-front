import { TeachersList } from '../../components/teachers/TeachersList'
import { useTeachers } from '../../hooks/useTeachers'

export const TeachersListPage = () => {
  const { data, loading } = useTeachers()

  return <TeachersList items={data?.users || undefined} />
}
