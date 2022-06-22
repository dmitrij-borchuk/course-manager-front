import { collection } from '../api/firebase/firestore'
import { deleteUserRequest } from '../api/users'
import { ROLES } from '../config'
import { getRoles } from '../services/roles'
import { OrganizationUser } from '../types/user'
import { createUserInfo } from './userInfo'
import { createUser } from './users'

// TODO: rename to userInfoService

export async function deleteTeacher(id: string) {
  return deleteUserRequest(id)
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
  const teacherRole = rolesResponse.data.roles.find((r) => r.name === ROLES.Teacher)

  if (!teacherRole) {
    throw new Error(`Can't find role with name ${ROLES.Teacher}`)
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

export async function editTeacher(orgId: string, data: OrganizationUser) {
  const orgUsers = collection<OrganizationUser>(`organizations/${orgId}/users`)
  return await orgUsers.save(data)
}
