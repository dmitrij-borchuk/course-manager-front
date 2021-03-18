import { useCallback, useState } from 'react'
import { createUserRequest } from '../api/users'
import { NewUser } from '../types/user'

type CreateUserProps = Omit<NewUser, 'username'>
export async function createUser(data: CreateUserProps) {
  return await createUserRequest({
    ...data,
    username: data.email,
  })
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
