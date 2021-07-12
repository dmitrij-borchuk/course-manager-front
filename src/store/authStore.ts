import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import firebase from 'firebase'
import { ROUTES } from '../constants'
import auth, { login, register, logout } from '../api/firebase/auth'

export function useAuthStore() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  const [initiatingAuth, setInitiatingAuth] = useState(true)
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setInitiatingAuth(false)
    })
  }, [])

  return {
    loading,
    currentUser,
    initiatingAuth,
    login: useCallback(async (...data: Parameters<typeof login>) => {
      setLoading(true)
      try {
        const response = await login(...data)

        return response
      } catch (error) {
        throw error
      } finally {
        setLoading(false)
      }
    }, []),
    register: useCallback(async (...data: Parameters<typeof register>) => {
      setLoading(true)
      try {
        const response = await register(...data)

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
