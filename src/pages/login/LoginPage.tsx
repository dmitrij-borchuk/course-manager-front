import { ComponentProps, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { ROUTES } from '../../constants'
import { useAuthState } from '../../store'
import { Login } from '../../components/auth/Login'
import { TITLE_POSTFIX } from '../../config'
import { isFirebaseError } from '../../utils/error'
import { useIntl } from 'react-intl'

type SubmitData = Parameters<ComponentProps<typeof Login>['onSubmit']>[0]

export const LoginPage = () => {
  const intl = useIntl()
  const history = useHistory()
  const { addToast } = useToasts()
  const { login, loading } = useAuthState()
  const redirect = new URLSearchParams(history.location.search).get('redirect')
  const redirectPath = redirect || ROUTES.ROOT
  const onLoginSubmit = useCallback(
    async (data: SubmitData) => {
      try {
        await login(data.identifier, data.password)

        history.push(redirectPath)
      } catch (error: unknown) {
        if (isFirebaseError(error)) {
          if (['auth/user-not-found', 'auth/wrong-password'].includes(error.code)) {
            addToast(intl.formatMessage({ id: 'auth.login.wrongLoginPassword' }), {
              appearance: 'error',
              autoDismiss: true,
            })
            return
          }

          addToast(error.message, {
            appearance: 'error',
            autoDismiss: true,
          })

          return
        }

        if (error instanceof Error) {
          addToast(error.message, {
            appearance: 'error',
            autoDismiss: true,
          })
          return
        }
        addToast(intl.formatMessage({ id: 'common.unknownError' }), {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, history, intl, login, redirectPath]
  )

  return (
    <>
      <Helmet>
        <title>Login{TITLE_POSTFIX}</title>
      </Helmet>

      <Login onSubmit={onLoginSubmit} loading={loading} />
    </>
  )
}

export default LoginPage
