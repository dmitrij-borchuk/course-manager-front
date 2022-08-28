import { collection } from '../api/firebase/firestore'
import { deleteUserRequest } from '../api/users'
import { OrganizationUser } from '../types/user'

export async function deleteTeacher(id: string) {
  return deleteUserRequest(id)
}

export async function editTeacher(orgId: string, data: OrganizationUser) {
  const orgUsers = collection<OrganizationUser>(`organizations/${orgId}/users`)
  return await orgUsers.save(data)
}
