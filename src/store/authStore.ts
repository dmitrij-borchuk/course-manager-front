import { useCallback, useEffect, useMemo, useState } from 'react'
import { User } from 'firebase/auth'
import { login, register, logout, resetPassword } from '../api/firebase/auth'
import { auth } from '../api/firebase'
import { AppUser } from '../types/user'
import { users } from '../api/firebase/collections'
import { setUser } from '../utils/rollbar'
import { setHeader } from '../api/request'

export function useAuthStore() {
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const appUser: AppUser = useMemo(
    () => ({
      name: currentUser?.displayName || undefined,
      avatar: currentUser?.photoURL || undefined,
    }),
    [currentUser?.displayName, currentUser?.photoURL]
  )
  const [initiatingAuth, setInitiatingAuth] = useState(true)
  useEffect(() => {
    auth.onIdTokenChanged(async (user) => {
      console.log('=-= onIdTokenChanged', user)
      setCurrentUser(user)
      setUser(user)
      if (user) {
        const token = await user.getIdToken()
        setHeader('authorization', token)
      }
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
    register: useCallback(async (name: string, email: string, password: string) => {
      setLoading(true)
      try {
        const response = await register(email, password)

        if (!response.user) {
          throw new Error('Error while registration, please contact your administrator.')
        }
        const result = await users.save({
          id: response.user.uid,
          email: response.user.email || undefined,
          name: name,
        })

        return result
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
