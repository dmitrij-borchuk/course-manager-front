import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router'
import { useToasts } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'
import { ConfirmInvite } from '../../components/users/ConfirmInvite'
import { useOrgId } from '../../hooks/useOrgId'
import { useOrganizationsState, useUsersState } from '../../store'
import { useAuthStore } from '../../store/authStore'
import { TITLE_POSTFIX } from '../../config'
import { Loader } from 'components/kit/loader/Loader'
import { Message } from 'components/kit/message/Message'
import { Header } from 'components/kit/header/Header'
import { isAxiosError } from 'api/request'

// TODO: rethink it, keep in mind new organization flow
export const ConfirmInvitePage = () => {
  const { addToast } = useToasts()
  const { submitting, confirmInvitation, profile } = useUsersState()
  const { fetchAll, getInviteInfo, inviteInfo, inviteInfoError } = useOrganizationsState()
  const parsedError = parseError(inviteInfoError)
  const { currentUser } = useAuthStore()
  const { token } = useParams<{ token: string }>()
  const orgId = useOrgId()
  const onSubmit = useCallback(
    async (data: { name: string }) => {
      if (orgId && currentUser?.uid) {
        try {
          await confirmInvitation(orgId, currentUser.uid, token, 'Teacher', data.name)
          await fetchAll()
        } catch (error: any) {
          addToast(error?.response?.data?.message || error?.response?.data || error.message, {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      }
    },
    [addToast, confirmInvitation, currentUser?.uid, fetchAll, orgId, token]
  )

  useEffect(() => {
    getInviteInfo(token)
  }, [getInviteInfo, token])

  if (parsedError) {
    return (
      <>
        <Header />
        <Message type="error">{parsedError}</Message>
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

      <ConfirmInvite onSubmit={onSubmit} loading={submitting} user={profile} inviteInfo={inviteInfo} />
    </>
  )
}

function parseError(error?: Error) {
  if (!error) {
    return
  }
  if (isAxiosError(error)) {
    return error.response?.data
  }
  return error.message
}
