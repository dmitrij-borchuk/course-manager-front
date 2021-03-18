import React, { useCallback } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useLoginMutation, UsersPermissionsLoginInput } from '../../api'
import { parseError } from '../../utils/error'
import { ROUTES } from '../../constants'
import { Login } from '../../components/login/Login'
import { setAuthData } from '../../services/auth'

export const LoginPage = () => {
  const { addToast } = useToasts()
  let history = useHistory()
  const [login, result] = useLoginMutation()
  const { loading } = result
  const { formatMessage } = useIntl()
  const onLoginSubmit = useCallback(
    async (data: UsersPermissionsLoginInput) => {
      try {
        const response = await login({
          variables: {
            input: data,
          },
        })

        if (response.data?.login.jwt) {
          setAuthData(response.data?.login.jwt)
          history.push(ROUTES.ROOT)
        } else {
          addToast(formatMessage({ id: 'Auth.form.error.500' }), {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      } catch (error) {
        // const massages = parseError(error).map((key) => formatMessage({ id: key }))
        addToast(parseError(error), {
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
