import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useStudentsState } from '../../store'
import { ROUTES } from '../../constants'
import { Student } from '../../components/students/Student'
import { useOrgId } from '../../hooks/useOrgId'
import { TITLE_POSTFIX } from '../../config'
import { useCurrentOrg } from '../../hooks/useCurrentOrg'

// TODO: Add 404 state
export const StudentPage = () => {
  const history = useHistory()
  let { id: idStr } = useParams<{ id: string }>()
  const id = parseInt(idStr)

  const { fetchStudent, studentsById, deleteStudent } = useStudentsState()
  const student = studentsById.get(id)
  const orgKey = useOrgId()
  const organization = useCurrentOrg()

  const onDelete = useCallback(async () => {
    if (organization && student) {
      await deleteStudent(orgKey, organization.id, id, student.outerId)
      // TODO: Add notification
      history.push(`/${orgKey}${ROUTES.STUDENTS_LIST}`)
    }
  }, [deleteStudent, history, id, orgKey, organization, student])

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
      <Helmet>
        <title>Student{TITLE_POSTFIX}</title>
      </Helmet>

      <Student data={student} onDelete={onDelete} />
    </>
  )
}

export default StudentPage
