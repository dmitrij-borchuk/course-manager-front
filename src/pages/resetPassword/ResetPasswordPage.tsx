import { ComponentProps, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { useIntl } from 'react-intl'
import { ROUTES } from '../../constants'
import { useAuthState } from '../../store'
import { useOrgIdNotStrict } from '../../hooks/useOrgId'
import { ResetPassword } from '../../components/auth/ResetPassword'

type SubmitData = Parameters<ComponentProps<typeof ResetPassword>['onSubmit']>[0]

export const ResetPasswordPage = () => {
  const orgId = useOrgIdNotStrict()
  const intl = useIntl()
  const orgPrefix = orgId ? `/${orgId}` : ''
  const history = useHistory()
  const { addToast } = useToasts()
  const { loading, resetPassword } = useAuthState()
  const onSubmit = useCallback(
    async (data: SubmitData) => {
      try {
        await resetPassword(data.email)

        addToast(intl.formatMessage({ id: 'auth.reset.success' }), {
          appearance: 'success',
          autoDismiss: true,
        })
        history.push(`${orgPrefix}${ROUTES.LOGIN}`)
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, history, intl, orgPrefix, resetPassword]
  )

  return (
    <>
      <ResetPassword onSubmit={onSubmit} loading={loading} />
    </>
  )
}
