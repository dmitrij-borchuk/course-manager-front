import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { confirmInvitation, inviteUser } from '../services/users'
import { Invite } from '../types/invite'

export default function useUsersStore() {
  const history = useHistory()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<Error>()

  return {
    submitting,
    error,
    inviteUser: useCallback(async (orgId: string, data: Invite) => {
      setSubmitting(true)
      try {
        const result = await inviteUser(orgId, data)
        setSubmitting(false)
        return result
      } catch (error: any) {
        setError(error)
        setSubmitting(false)
      }
    }, []),
    confirmInvitation: useCallback(
      async (orgId: string, userId: string, token: string) => {
        setSubmitting(true)
        try {
          await confirmInvitation(orgId, userId, token)
          setSubmitting(false)

          history.push(`/${orgId}/`)
        } catch (error: any) {
          setError(error)
          setSubmitting(false)
        }
      },
      [history]
    ),
  }
}
