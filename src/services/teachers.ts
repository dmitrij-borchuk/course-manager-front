import { useCallback } from 'react'
import { UserInfoInput, useUpdateTeacherMutation } from '../api'
import { getUsersRequest } from '../api/users'
import { ROUTES, TEACHER_ROLE_NAME } from '../constants'
import { useCallbackWithRedirect } from '../hooks/useCallbackWithRedirect'
import { getRoles } from '../services/roles'
import { createUserInfo } from './userInfo'
import { createUser } from './users'

export async function getTeachersList() {
  // TODO: improve it
  const rolesResponse = await getRoles()
  const teacherRole = rolesResponse.data.roles.find((r) => r.name === TEACHER_ROLE_NAME)

  return getUsersRequest(`role=${teacherRole?.id}`)
}

type CreateTeacherProps = {
  name: string
  email: string
  password: string
  description: string
}
export async function createTeacher(data: CreateTeacherProps) {
  const rolesResponse = await getRoles()
  const teacherRole = rolesResponse.data.roles.find((r) => r.name === TEACHER_ROLE_NAME)

  if (!teacherRole) {
    throw new Error(`Can't find role with name ${TEACHER_ROLE_NAME}`)
  }

  const response = await createUser({ ...data, role: teacherRole.id })
  const userId = response.data.id

  return await createUserInfo({
    ...data,
    user: userId,
  })
}

export function useEditTeacher(id?: string) {
  const [update, result] = useUpdateTeacherMutation()
  const updateUserInfoMutation = useCallback(
    (data: UserInfoInput) =>
      update({
        variables: {
          input: {
            data,
          },
        },
      }),
    [update]
  )
  const updateTeacher = useCallbackWithRedirect<UserInfoInput>(updateUserInfoMutation, `${ROUTES.TEACHERS_ROOT}/${id}`)

  return [updateTeacher, result.loading] as const
}
