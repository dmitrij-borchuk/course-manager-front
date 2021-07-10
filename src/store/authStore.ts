import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import firebase from 'firebase'
import { ROUTES } from '../constants'
import { login, logout } from '../api/firebase/auth'

export function useAuthStore() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)

  return {
    loading,
    currentUser,
    login: useCallback(async (...data: Parameters<typeof login>) => {
      setLoading(true)
      try {
        const response = await login(...data)
        setCurrentUser(response)

        return response
      } catch (error) {
        throw error
      } finally {
        setLoading(false)
      }
    }, []),
    logout: useCallback(() => {
      logout()
      history.push(ROUTES.ROOT)
    }, [history]),
  }
}
