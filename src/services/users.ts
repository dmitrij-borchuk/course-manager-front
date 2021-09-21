import { useCallback, useState } from 'react'
import { collection } from '../api/firebase/firestore'
import { createUserRequest } from '../api/users'
import { NewUser, OrganizationUser } from '../types/user'

export async function createUser(data: NewUser) {
  return await createUserRequest(data)
}

export function useCreateUser() {
  const [loading, setLoading] = useState(false)
  const createUser = useCallback(async (data: any) => {
    // let res!: ReturnType<typeof createUserRequest>
    setLoading(true)
    try {
      return await createUserRequest(data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [])

  return [createUser, loading] as const
}

export async function addUserToOrganization(orgId: string, user: OrganizationUser) {
  const orgUsers = collection<OrganizationUser>(`organizations/${orgId}/users`)
  await orgUsers.save(user)
}
