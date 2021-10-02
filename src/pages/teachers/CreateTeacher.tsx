import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { EditTeacher } from '../../components/teachers/EditTeacher'
import { ROUTES } from '../../constants'
import { useApiCallLazy } from '../../hooks/useApiCall'
import { createTeacher } from '../../services/teachers'

// TODO: do we need it
export const CreateTeacherPage = () => {
  const history = useHistory()
  // TODO: use store
  const [create, { loading, error, data }] = useApiCallLazy(createTeacher)

  useEffect(() => {
    if (data?.user_info.id) {
      history.push(`${ROUTES.TEACHERS_ROOT}/${data?.user_info.id}`)
    }
  }, [data?.user_info.id, history])

  // TODO: add loading overlay
  // TODO: probably we can preload roles on app start

  return <EditTeacher onSubmit={create} loading={loading} error={error} />
}
