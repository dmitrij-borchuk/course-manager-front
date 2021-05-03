import { TeachersList } from '../../components/teachers/TeachersList'
import { useApiCall } from '../../hooks/useApiCall'
import { getTeachersList } from '../../services/teachers'

export const TeachersListPage = () => {
  // TODO: use store
  const [resp, loading] = useApiCall(getTeachersList)

  return <TeachersList items={resp?.data} loading={loading} />
}
