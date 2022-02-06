import { useCallback, useState } from 'react'
import { users } from '../api/firebase/collections'
import { collection } from '../api/firebase/firestore'
import { createUserRequest } from '../api/users'
import { Role } from '../config'
import { NewUser, OrganizationUser } from '../types/user'

// TODO: cleanup
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

export async function confirmInvitation(orgId: string, userId: string, token: string, role: Role) {
  // TODO: fix any
  const orgUsers = collection<any>(`organizations/${orgId}/users`)
  const user = await users.getById(userId)
  await orgUsers.save({
    ...user,
    id: userId,
    role,
    token,
  })

  const userOrganizations = user.organizations || []
  // TODO: probably move to FireBase functions
  await users.save({
    ...user,
    organizations: userOrganizations.concat([orgId]),
  })
}

export async function getUsersList(orgId: string) {
  const orgUsers = collection<OrganizationUser>(`organizations/${orgId}/users`)
  return await orgUsers.getAll()
}
