import React from 'react'
import { UserInput, useCreateTeacherMutation } from '../../api'
import { EditTeacher } from '../../components/teachers/EditTeacher'
import { ROUTES } from '../../constants'
import { useMutationWithRedirect } from '../../hooks/useMutationWithRedirect'

export const EditTeacherPage = () => {
  const [edit, result] = useCreateTeacherMutation()
  const editTeacher = useMutationWithRedirect<UserInput>(
    (data) =>
      edit({
        variables: {
          input: { data },
        },
      }),
    ROUTES.TEACHERS_LIST
  )

  return <EditTeacher onSubmit={editTeacher} loading={result.loading} />
}
