import React, { useCallback } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useLoginMutation, UsersPermissionsLoginInput } from '../../api'
import { parseError } from '../../utils/error'
import { ROUTES } from '../../constants'
import { Login } from '../../components/login/Login'

export const LoginPage = () => {
  const { addToast } = useToasts()
  let history = useHistory()
  const [login, result] = useLoginMutation()
  const { loading } = result
  const { formatMessage } = useIntl()
  const onLoginSubmit = useCallback(
    async (data: UsersPermissionsLoginInput) => {
      try {
        await login({
          variables: {
            input: data,
          },
        })
        history.push(ROUTES.ROOT)
      } catch (error) {
        const massages = parseError(error).map((key) => formatMessage({ id: key }))
        addToast(massages.join(';'), {
          appearance: 'error',
          autoDismiss: true,
        })
      }
    },
    [login, addToast, formatMessage, history]
  )

  return (
    <>
      <Login onSubmit={onLoginSubmit} loading={loading} />
    </>
  )
}
