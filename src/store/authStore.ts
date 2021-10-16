import { useCallback, useEffect, useMemo, useState } from 'react'
import firebase from 'firebase'
import auth, { login, register, logout, resetPassword } from '../api/firebase/auth'
import { AppUser } from '../types/user'

export function useAuthStore() {
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  const appUser: AppUser = useMemo(
    () => ({
      name: currentUser?.displayName || undefined,
      avatar: currentUser?.photoURL || undefined,
    }),
    [currentUser?.displayName, currentUser?.photoURL]
  )
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
    appUser,
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
      return logout()
    }, []),
    resetPassword: useCallback((email: string) => {
      return resetPassword(email)
    }, []),
  }
}
