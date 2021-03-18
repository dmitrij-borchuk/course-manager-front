import { EditTeacher } from '../../components/teachers/EditTeacher'
import { useApiCallLazy } from '../../hooks/useApiCall'
import { createTeacher } from '../../services/teachers'

export const CreateTeacherPage = () => {
  const [create, data, loading] = useApiCallLazy(createTeacher)

  // TODO: add loading overlay
  // TODO: probably we can preload roles on app start

  return <EditTeacher onSubmit={create} loading={loading} />
}
