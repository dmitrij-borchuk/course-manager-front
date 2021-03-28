import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { ROUTES } from '../../constants'
import { setAuthData } from '../../services/auth'

export const LogoutPage = () => {
  const history = useHistory()

  useEffect(() => {
    setAuthData('')
    history.push(ROUTES.ROOT)
  }, [history])

  return null
}
