import React, { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Loader } from '../../components/kit/loader/Loader'
import { EditStudent, StudentForm } from '../../components/students/EditStudent'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { useStudentsState } from '../../store'

export const EditStudentPage = () => {
  const history = useHistory()
  const orgId = useOrgId()
  let { id } = useParams<{ id: string }>()
  const { fetchStudent, editStudent, fetching, submitting, studentsById } = useStudentsState()

  const student = studentsById[id]
  const update = useCallback(
    async (data: StudentForm) => {
      if (!student) {
        return
      }

      await editStudent(orgId, {
        ...student,
        // attendances: student.attendances?.map((a) => a.id),
        // groups: student.groups?.map((g) => g.id),
        ...data,
      })
      history.push(`/${orgId}${ROUTES.STUDENTS_ROOT}/${student.id}`)
    },
    [editStudent, history, orgId, student]
  )

  useEffect(() => {
    fetchStudent(orgId, id)
  }, [fetchStudent, id, orgId])
  // TODO: implement 404

  return (
    <Loader show={fetching}>
      <EditStudent onSubmit={update} loading={submitting} initial={student} isEdit />
    </Loader>
  )
}

export default EditStudentPage
