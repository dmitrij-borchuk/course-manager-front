import { ComponentProps, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { ROUTES } from '../../constants'
import { useAuthState } from '../../store'
import { Login } from '../../components/auth/Login'
import { useOrgIdNotStrict } from '../../hooks/useOrgId'

type SubmitData = Parameters<ComponentProps<typeof Login>['onSubmit']>[0]

export const LoginPage = () => {
  const orgId = useOrgIdNotStrict()
  const orgPrefix = orgId ? `/${orgId}` : ''
  const history = useHistory()
  const { addToast } = useToasts()
  const { login, loading } = useAuthState()
  const onLoginSubmit = useCallback(
    async (data: SubmitData) => {
      try {
        await login(data.identifier, data.password)

        history.push(`${orgPrefix}${ROUTES.ROOT}`)
      } catch (error) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [login, history, orgPrefix, addToast]
  )

  return (
    <>
      <Login onSubmit={onLoginSubmit} loading={loading} />
    </>
  )
}
