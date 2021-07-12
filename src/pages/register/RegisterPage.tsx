import { ComponentProps, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { ROUTES } from '../../constants'
import { useAuthState } from '../../store'
import { Register } from '../../components/auth/Register'

type SubmitData = Parameters<ComponentProps<typeof Register>['onSubmit']>[0]

export const RegisterPage = () => {
  const history = useHistory()
  const { addToast } = useToasts()
  const { register, loading } = useAuthState()
  const onSubmit = useCallback(
    async (data: SubmitData) => {
      try {
        await register(data.email, data.password)

        history.push(ROUTES.ROOT)
      } catch (error) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [register, history, addToast]
  )

  return (
    <>
      <Register onSubmit={onSubmit} loading={loading} />
    </>
  )
}
