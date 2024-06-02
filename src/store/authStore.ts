import { useCallback, useEffect, useMemo, useState } from 'react'
import { User as FBUser } from 'firebase/auth'
import { login, logout, resetPassword } from '../api/firebase/auth'
import { auth } from '../api/firebase'
import { AppUser } from '../types/user'
import { setUser } from '../utils/rollbar'
import { setHeader } from '../api/request'
import { registerUser } from 'api/users'

export function useAuthStore() {
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<FBUser | null>(null)
  const appUser: AppUser = useMemo(
    () => ({
      name: currentUser?.displayName || undefined,
      avatar: currentUser?.photoURL || undefined,
    }),
    [currentUser?.displayName, currentUser?.photoURL]
  )
  const [initiatingAuth, setInitiatingAuth] = useState(true)
  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      setCurrentUser(user)
      setUser(user)
      if (user) {
        const token = await user.getIdToken()
        setHeader('authorization', token)
      } else {
        setHeader('authorization')
      }
      setInitiatingAuth(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return {
    loading,
    /** @deprecated use `state.application.auth.data` instead */
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
    register: useCallback(async (name: string, email: string, password: string) => {
      setLoading(true)
      try {
        const response = await registerUser({ email, password, name })

        if (!response.data) {
          throw new Error('Error while registration, please contact your administrator.')
        }

        return response.data
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
