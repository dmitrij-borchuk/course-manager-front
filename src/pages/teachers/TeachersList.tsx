import { useMemo } from 'react'
import { TeachersList } from '../../components/teachers/TeachersList'
import { useApiCall } from '../../hooks/useApiCall'
import { getTeachersList } from '../../services/teachers'

export const TeachersListPage = () => {
  // TODO: use store
  const [resp, loading] = useApiCall(getTeachersList)
  const items = useMemo(
    () =>
      resp?.data.map((t) => ({
        id: t.id,
        name: t.user_info?.name || '',
      })),
    [resp?.data]
  )

  return <TeachersList items={items} loading={loading} />
}
