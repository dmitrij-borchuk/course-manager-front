import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useStudentsState } from '../../store'
import { ROUTES } from '../../constants'
import { Student } from '../../components/students/Student'

// TODO: Add 404 state
export const StudentPage = () => {
  const history = useHistory()
  let { id: idStr } = useParams<{ id: string }>()
  const id = parseInt(idStr)

  const { fetchStudent, studentsById, deleteStudent } = useStudentsState()
  const student = studentsById.get(id)

  const onDelete = useCallback(async () => {
    await deleteStudent(id)
    // TODO: Add notification
    history.push(`${ROUTES.STUDENTS_LIST}`)
  }, [deleteStudent, history, id])

  useEffect(() => {
    fetchStudent(id)
  }, [fetchStudent, id])

  if (!student) {
    return (
      <div key="loader" data-testid="preloader">
        Loading
      </div>
    )
  }

  return (
    <>
      <Student data={student} onDelete={onDelete} />
    </>
  )
}

export default StudentPage
