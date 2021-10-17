import { ComponentProps, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { ROUTES } from '../../constants'
import { useAuthState } from '../../store'
import { useOrgIdNotStrict } from '../../hooks/useOrgId'
import { Register } from '../../components/auth/Register'

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
        await register(data.email, data.password)

        history.push(`${orgPrefix}${ROUTES.ROOT}`)
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
      <Register onSubmit={onSubmit} loading={loading} />
    </>
  )
}
