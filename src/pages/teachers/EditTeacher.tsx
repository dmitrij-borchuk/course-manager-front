import React, { useMemo } from 'react'
import { UserInput, useCreateTeacherMutation } from '../../api'
import { EditTeacher } from '../../components/teachers/EditTeacher'
import { ROUTES, TEACHER_ROLE_NAME } from '../../constants'
import { useMutationWithRedirect } from '../../hooks/useMutationWithRedirect'
import { useRoles } from '../../hooks/useRoles'

export const EditTeacherPage = () => {
  const [edit, result] = useCreateTeacherMutation()
  const { data: rolesResponse, loading: rolesLoading } = useRoles()
  const roles = rolesResponse?.roles
  const teacherRole = useMemo(() => roles?.find((r) => r.name === TEACHER_ROLE_NAME), [roles])
  const editTeacher = useMutationWithRedirect<UserInput>(
    (data) =>
      edit({
        variables: {
          input: {
            data: {
              ...data,
              username: data.email,
              role: teacherRole?.id,
            },
          },
        },
      }),
    ROUTES.TEACHERS_LIST
  )

  // TODO: add loading overlay

  return <EditTeacher onSubmit={editTeacher} loading={result.loading} />
}
