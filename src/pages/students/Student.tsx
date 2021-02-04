import { useParams } from 'react-router-dom'
import { Student } from '../../components/students/Student'
import { useStudent } from '../../hooks/useStudent'

// TODO: Add loading skeleton
export const StudentPage = () => {
  let { id } = useParams<{ id: string }>()
  const { data, loading } = useStudent({ variables: { id } })

  if (!data?.student) {
    return <div>Loading</div>
  }

  return <Student data={data?.student || undefined} />
}
