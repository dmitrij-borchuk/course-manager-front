import { ComponentProps, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import { useDefaultErrorHandler } from 'utils/error'
import { ROUTES } from '../../constants'
import { useAuthState } from '../../store'
import { Register } from '../../components/auth/Register'
import { TITLE_POSTFIX } from '../../config'

type SubmitData = Parameters<ComponentProps<typeof Register>['onSubmit']>[0]

export const RegisterPage = () => {
  const history = useHistory()
  const { addToast } = useToasts()
  const { register, loading } = useAuthState()
  const handleError = useDefaultErrorHandler()
  const redirect = new URLSearchParams(history.location.search).get('redirect')
  const redirectPath = redirect ? `?redirect=${redirect}` : ''
  const onSubmit = useCallback(
    async (data: SubmitData) => {
      try {
        await register(data.name, data.email, data.password)

        history.push(`${ROUTES.LOGIN}${redirectPath}`)

        addToast(<FormattedMessage id="auth.register.success" />, {
          appearance: 'success',
          autoDismiss: true,
        })
      } catch (error) {
        handleError(error)
      }
    },
    [register, history, redirectPath, addToast, handleError]
  )

  return (
    <>
      <Helmet>
        <title>Register{TITLE_POSTFIX}</title>
      </Helmet>

      <Register onSubmit={onSubmit} loading={loading} />
    </>
  )
}
