import { useCallback, useState } from 'react'
import { login, setAuthData } from '../services/auth'

export function useAuthStore() {
  const [loading, setLoading] = useState(false)

  return {
    loading,
    login: useCallback(async (data: Parameters<typeof login>[0]) => {
      setLoading(true)
      const response = await login(data)
      setLoading(false)

      if (response.data.jwt) {
        setAuthData(response.data.jwt)
      }

      return response
    }, []),
    clearAuthData: useCallback(() => {
      setAuthData('')
    }, []),
  }
}
