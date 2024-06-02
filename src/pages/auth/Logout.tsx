import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { ROUTES } from '../../constants'
import { useAuthState } from '../../store'
import { TITLE_POSTFIX } from '../../config'
import { sendToAnalytics } from '../../utils/analytics'

export const LogoutPage = () => {
  const history = useHistory()
  const { logout } = useAuthState()
  const onLogout = useCallback(async () => {
    await logout()
    // TODO: clear profile

    sendToAnalytics({
      user_Id: null,
    })

    history.push(ROUTES.LOGIN)
  }, [history, logout])

  useEffect(() => {
    onLogout()
  }, [onLogout])

  return (
    <>
      <Helmet>
        <title>Logout{TITLE_POSTFIX}</title>
      </Helmet>
    </>
  )
}
