import { useEffect } from 'react'
import { useAuthState } from '../../store'

export const LogoutPage = () => {
  const { logout } = useAuthState()

  useEffect(() => {
    logout()
  }, [logout])

  return null
}
