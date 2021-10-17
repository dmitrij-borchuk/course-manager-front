import React, { useCallback } from 'react'
import { useHistory } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import { Loader } from '../../components/kit/loader/Loader'
import { EditStudent, StudentForm } from '../../components/students/EditStudent'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { useStudentsState } from '../../store'

export const CreateStudent = () => {
  const { addToast } = useToasts()
  const history = useHistory()
  const orgId = useOrgId()
  const { createStudent, fetching, submitting } = useStudentsState()

  const submit = useCallback(
    async (data: StudentForm) => {
      try {
        const result = await createStudent(orgId, {
          ...data,
        })
        history.push(`/${orgId}${ROUTES.STUDENTS_ROOT}/${result.id}`)
      } catch (error) {
        if (error instanceof Error) {
          addToast(error.message, {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      }
    },
    [addToast, createStudent, history, orgId]
  )

  return (
    <Loader show={fetching}>
      <EditStudent onSubmit={submit} loading={submitting} />
    </Loader>
  )
}

export default CreateStudent
