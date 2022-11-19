import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { ROUTES } from '../../constants'
import { useOrgIdNotStrict } from '../../hooks/useOrgId'
import { useAuthState } from '../../store'
import { TITLE_POSTFIX } from '../../config'
import { sendToAnalytics } from '../../utils/analitics'

export const LogoutPage = () => {
  const history = useHistory()
  const orgId = useOrgIdNotStrict()
  const { logout } = useAuthState()
  const onLogout = useCallback(async () => {
    await logout()
    // TODO: clear profile

    sendToAnalytics({
      user_Id: null,
    })

    if (orgId) {
      history.push(`/${orgId}${ROUTES.LOGIN}`)
      return
    }

    history.push(ROUTES.LOGIN)
  }, [history, logout, orgId])

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
