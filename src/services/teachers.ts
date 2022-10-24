import { collection } from '../api/firebase/firestore'
import { OrganizationUser } from '../types/user'

export async function editTeacher(orgId: string, data: OrganizationUser) {
  const orgUsers = collection<OrganizationUser>(`organizations/${orgId}/users`)
  return await orgUsers.save(data)
}
