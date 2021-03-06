import React, { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Loader } from '../../components/kit/loader/Loader'
import { EditStudent, StudentForm } from '../../components/students/EditStudent'
import { ROUTES } from '../../constants'
import { useStudentsState } from '../../store'

export const EditStudentPage = () => {
  const history = useHistory()
  let { id } = useParams<{ id: string }>()
  const { fetchStudent, editStudent, fetching, submitting, studentsById } = useStudentsState()

  const student = studentsById[id]
  const update = useCallback(
    async (data: StudentForm) => {
      if (!student) {
        return
      }

      await editStudent({
        ...student,
        attendances: student.attendances?.map((a) => a.id),
        groups: student.groups?.map((g) => g.id),
        ...data,
      })
      history.push(`${ROUTES.STUDENTS_ROOT}/${student.id}`)
    },
    [editStudent, history, student]
  )

  useEffect(() => {
    fetchStudent(id)
  }, [fetchStudent, id])
  // TODO: implement 404

  return (
    <Loader show={fetching}>
      <EditStudent onSubmit={update} loading={submitting} initial={student} isEdit />
    </Loader>
  )
}

export default EditStudentPage
