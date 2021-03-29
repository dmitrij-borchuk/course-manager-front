import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Student } from '../../components/students/Student'
import { useStudentsState } from '../../store'

// TODO: Add loading skeleton
export const StudentPage = () => {
  let { id } = useParams<{ id: string }>()
  const { fetchStudent, studentsById } = useStudentsState()
  const student = studentsById[id]

  useEffect(() => {
    fetchStudent(id)
  }, [fetchStudent, id])

  if (!student) {
    return <div>Loading</div>
  }

  return <Student data={student} />
}
