import { useCallback } from 'react'
import { UserInfoInput, useUpdateTeacherMutation } from '../api'
import { updateUserInfoRequest } from '../api/userInfo'
import { getUsersRequest, getUserRequest } from '../api/users'
import { ROUTES, TEACHER_ROLE_NAME } from '../constants'
import { useCallbackWithRedirect } from '../hooks/useCallbackWithRedirect'
import { getRoles } from '../services/roles'
import { createUserInfo } from './userInfo'
import { createUser } from './users'

// TODO: rename to userInfoService

export async function getTeachersList() {
  // TODO: improve it, request roles on app startup
  const rolesResponse = await getRoles()
  const teacherRole = rolesResponse.data.roles.find((r) => r.name === TEACHER_ROLE_NAME)

  return getUsersRequest(`role=${teacherRole?.id}`)
}

export async function getTeacher(id: string) {
  return getUserRequest(id)
}

type CreateTeacherProps = {
  name: string
  username: string
  email: string
  password: string
  description?: string
}
export async function createTeacher(data: CreateTeacherProps) {
  const rolesResponse = await getRoles()
  const teacherRole = rolesResponse.data.roles.find((r) => r.name === TEACHER_ROLE_NAME)

  if (!teacherRole) {
    throw new Error(`Can't find role with name ${TEACHER_ROLE_NAME}`)
  }

  const userResponse = await createUser({ ...data, role: teacherRole.id })
  const userId = userResponse.data.id

  const userInfo = await createUserInfo({
    ...data,
    user: userId,
  })

  return {
    ...userResponse.data,
    user_info: userInfo.data,
  }
}

type EditTeacherProps = {
  userInfoId: string
  name: string
  description?: string
}
export async function editTeacher(data: EditTeacherProps) {
  return await updateUserInfoRequest({
    id: data.userInfoId,
    ...data,
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
