import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { useOrgId } from '../../hooks/useOrgId'
import { useAuthState } from '../../store'

export const LogoutPage = () => {
  const history = useHistory()
  const orgId = useOrgId()
  const { logout } = useAuthState()
  const onLogout = useCallback(async () => {
    await logout()

    if (orgId) {
      history.push(`/${orgId}${ROUTES.LOGIN}`)
      return
    }

    history.push(ROUTES.LOGIN)
  }, [history, logout, orgId])

  useEffect(() => {
    onLogout()
  }, [onLogout])

  return null
}
