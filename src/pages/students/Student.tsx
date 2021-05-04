import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Student } from '../../components/students/Student'
import { ROUTES } from '../../constants'
import { useStudentsState } from '../../store'

// TODO: Add loading skeleton
// TODO: Add 404 state
export const StudentPage = () => {
  const history = useHistory()
  let { id } = useParams<{ id: string }>()

  const { fetchStudent, studentsById, deleteStudent } = useStudentsState()
  const student = studentsById[id]

  const onDelete = useCallback(async () => {
    await deleteStudent(id)
    history.push(ROUTES.STUDENTS_LIST)
  }, [deleteStudent, history, id])

  useEffect(() => {
    fetchStudent(id)
  }, [fetchStudent, id])

  if (!student) {
    return <div>Loading</div>
  }

  return <Student data={student} onDelete={onDelete} />
}

export default StudentPage
