import { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet'
import { Container, Toolbar } from '@mui/material'
import { useAppDispatch } from 'store/hooks'
import { isAxiosError } from 'api/request'
import { calcCurrentOrganization } from 'modules/organizations/store/currentOrg'
import { useNotification } from 'hooks/useNotification'
import { Loader } from 'components/kit/loader/Loader'
import { Message } from 'components/kit/message/Message'
import { Header } from 'components/kit/header/Header'
import { ConfirmInvite } from '../../components/users/ConfirmInvite'
import { useAuthState, useOrganizationsState, useUsersState } from '../../store'
import { TITLE_POSTFIX } from '../../config'
import { ROUTES } from '../../constants'

export const ConfirmInvitePage = () => {
  const { initiatingAuth, currentUser } = useAuthState()
  const dispatch = useAppDispatch()
  const { submitting, confirmInvitation, profile, fetchProfile } = useUsersState()
  const { fetchAll, getInviteInfo, inviteInfo, inviteInfoError } = useOrganizationsState()
  const history = useHistory()
  const { showError } = useNotification()
  const parsedError = parseError(inviteInfoError)
  const { token } = useParams<{ token: string }>()
  const onSubmit = useCallback(
    async (data: { name: string }) => {
      try {
        await confirmInvitation(token, data.name)
        await fetchAll()
        await dispatch(calcCurrentOrganization())

        history.push(`/`)
      } catch (error: any) {
        showError(error?.response?.data?.message || error?.response?.data || error.message)
      }
    },
    [confirmInvitation, dispatch, fetchAll, history, showError, token]
  )

  useEffect(() => {
    if (!initiatingAuth) {
      if (currentUser) {
        getInviteInfo(token)
        fetchProfile()
      } else {
        showError(<FormattedMessage id="users.invite.needLogin" />)
        history.push(`${ROUTES.LOGIN}?redirect=/invite/confirm/${token}`)
      }
    }
  }, [currentUser, getInviteInfo, history, initiatingAuth, showError, token, fetchProfile])

  if (parsedError) {
    return (
      <>
        <Header />
        <Container sx={{ mt: 2 }}>
          {/* To make some gap under the header */}
          <Toolbar />
          <Message type="error">{parsedError}</Message>
        </Container>
      </>
    )
  }

  if (!inviteInfo) {
    return (
      <>
        <Header />
        <Loader />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Confirm Invitation{TITLE_POSTFIX}</title>
      </Helmet>

      <Container sx={{ mt: 2 }}>
        {/* To make some gap under the header */}
        <Toolbar />
        <ConfirmInvite onSubmit={onSubmit} loading={submitting} user={profile} inviteInfo={inviteInfo} />
      </Container>
    </>
  )
}

function parseError(error?: Error) {
  if (!error) {
    return
  }
  if (isAxiosError<string>(error)) {
    return error.response?.data
  }
  return error.message
}
