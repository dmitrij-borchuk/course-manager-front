import { useParams } from 'react-router-dom'
import { useTeacher } from '../../hooks/useTeacher'
import { Teacher } from '../../components/teachers/Teacher'

// TODO: Add loading skeleton
export const TeacherPage = () => {
  let { id } = useParams<{ id: string }>()
  const { data, loading } = useTeacher({ variables: { id } })

  if (!data?.teacher) {
    return <div>Loading</div>
  }

  return <Teacher data={data?.teacher || undefined} />
}
