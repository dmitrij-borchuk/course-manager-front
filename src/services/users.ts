import { useCallback, useState } from 'react'
import { createUserRequest } from '../api/users'
import { NewUser } from '../types/user'

// TODO: cleanup
export async function createUser(data: NewUser) {
  return await createUserRequest(data)
}

export function useCreateUser() {
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createUser = useCallback(async (data: any) => {
    // let res!: ReturnType<typeof createUserRequest>
    setLoading(true)
    try {
      return await createUserRequest(data)
    } finally {
      setLoading(false)
    }
  }, [])

  return [createUser, loading] as const
}
