import { ComponentProps, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { useIntl } from 'react-intl'
import { Helmet } from 'react-helmet'
import { ROUTES } from '../../constants'
import { useAuthState } from '../../store'
import { ResetPassword } from '../../components/auth/ResetPassword'
import { TITLE_POSTFIX } from '../../config'

type SubmitData = Parameters<ComponentProps<typeof ResetPassword>['onSubmit']>[0]

export const ResetPasswordPage = () => {
  const intl = useIntl()
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
        history.push(`${ROUTES.LOGIN}`)
      } catch (error: any) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [addToast, history, intl, resetPassword]
  )

  return (
    <>
      <Helmet>
        <title>Reset password{TITLE_POSTFIX}</title>
      </Helmet>

      <ResetPassword onSubmit={onSubmit} loading={loading} />
    </>
  )
}
