import { ComponentProps, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { ROUTES } from '../../constants'
import { useAuthState } from '../../store'
import { useOrgIdNotStrict } from '../../hooks/useOrgId'
import { Register } from '../../components/auth/Register'
import { TITLE_POSTFIX } from '../../config'
import { FormattedMessage } from 'react-intl'

type SubmitData = Parameters<ComponentProps<typeof Register>['onSubmit']>[0]

export const RegisterPage = () => {
  const orgId = useOrgIdNotStrict()
  const orgPrefix = orgId ? `/${orgId}` : ''
  const history = useHistory()
  const { addToast } = useToasts()
  const { register, loading } = useAuthState()
  const onSubmit = useCallback(
    async (data: SubmitData) => {
      try {
        await register(data.name, data.email, data.password)

        history.push(`${orgPrefix}${ROUTES.LOGIN}`)

        addToast(<FormattedMessage id="auth.register.success" />, {
          appearance: 'success',
          autoDismiss: true,
        })
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [register, history, orgPrefix, addToast]
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
