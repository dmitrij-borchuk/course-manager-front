import { ComponentProps, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { useIntl } from 'react-intl'
import { ROUTES } from '../../constants'
import { useAuthState } from '../../store'
import { parseError } from '../../utils/error'
import { Login } from '../../components/login/Login'

type SubmitData = Parameters<ComponentProps<typeof Login>['onSubmit']>[0]

export const LoginPage = () => {
  const history = useHistory()
  const { addToast } = useToasts()
  const { login, loading, clearAuthData } = useAuthState()
  const { formatMessage } = useIntl()
  const onLoginSubmit = useCallback(
    async (data: SubmitData) => {
      try {
        clearAuthData()
        const response = await login(data)

        if (response.data.jwt) {
          history.push(ROUTES.ROOT)
        } else {
          addToast(formatMessage({ id: 'Auth.form.error.500' }), {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      } catch (error) {
        addToast(parseError(error), {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [clearAuthData, login, history, addToast, formatMessage]
  )

  return (
    <>
      <Login onSubmit={onLoginSubmit} loading={loading} />
    </>
  )
}
