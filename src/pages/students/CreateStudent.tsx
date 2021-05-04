import React, { useCallback } from 'react'
import { useHistory } from 'react-router'
import { Loader } from '../../components/kit/loader/Loader'
import { EditStudent, StudentForm } from '../../components/students/EditStudent'
import { ROUTES } from '../../constants'
import { useStudentsState } from '../../store'

export const CreateStudent = () => {
  const history = useHistory()
  const { createStudent, fetching, submitting } = useStudentsState()

  const submit = useCallback(
    async (data: StudentForm) => {
      const result = await createStudent({
        ...data,
      })
      history.push(`${ROUTES.STUDENTS_ROOT}/${result.data.id}`)
    },
    [createStudent, history]
  )

  return (
    <Loader show={fetching}>
      <EditStudent onSubmit={submit} loading={submitting} />
    </Loader>
  )
}

export default CreateStudent
