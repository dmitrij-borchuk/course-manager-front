import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  confirmInvitation,
  getProfile,
  getUserByOuterIdRequest,
  inviteUser,
  migrateUsers,
  updateUser,
} from '../api/users'
import { Role } from '../config'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { Dictionary } from '../types/dictionary'
import { InviteForm } from '../types/invite'
import { OrganizationUser, User } from '../types/user'
import { sendToAnalytics } from '../utils/analitics'

export default function useUsersStore() {
  const history = useHistory()
  const [profile, setProfile] = useState<User>()
  const [usersById, setUsersById] = useState<Dictionary<OrganizationUser>>({})
  const users = useDictionaryToArray(usersById)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<Error>()
  const [fetching, setFetching] = useState(false)

  return {
    profile,
    submitting,
    error,
    fetching,
    usersById,
    users,
    inviteUser: useCallback(async (orgId: number, data: InviteForm) => {
      setSubmitting(true)
      try {
        const result = await inviteUser({
          email: data.email,
          role: 'teacher',
          orgId,
        })
        setSubmitting(false)
        return result
      } catch (error: any) {
        setError(error)
        setSubmitting(false)
        throw error
      }
    }, []),
    confirmInvitation: useCallback(
      async (orgId: string, userId: string, token: string, role: Role) => {
        setSubmitting(true)
        try {
          await confirmInvitation(token)
          setSubmitting(false)

          history.push(`/${orgId}/`)
        } catch (error: any) {
          setError(error)
          setSubmitting(false)
          throw error
        }
      },
      [history]
    ),
    fetchOrgUser: useCallback(async (orgId: number, id: string) => {
      setFetching(true)
      const res = await getUserByOuterIdRequest(orgId, id)
      setUsersById((items) => ({ ...items, [res.data.id]: res.data }))
      setFetching(false)
    }, []),
    fetchProfile: useCallback(async () => {
      try {
        setFetching(true)
        const result = await getProfile()
        setProfile(result.data)
        setFetching(false)

        sendToAnalytics({
          user_Id: result.data.id,
        })

        return result.data
      } catch (error) {
        setFetching(false)
        throw error
      }
    }, []),
    migrate: useCallback(async () => {
      try {
        setSubmitting(true)
        const result = await migrateUsers()
        setSubmitting(false)
        return result
      } catch (error) {
        setSubmitting(false)
        throw error
      }
    }, []),
    updateUser: useCallback(
      async (user: User) => {
        try {
          setSubmitting(true)
          const result = await updateUser(user.id, user.name)
          if (profile && profile.id === user.id) {
            setProfile(result.data)
          }
          setSubmitting(false)
          return result
        } catch (error) {
          setSubmitting(false)
          throw error
        }
      },
      [profile]
    ),
  }
}
