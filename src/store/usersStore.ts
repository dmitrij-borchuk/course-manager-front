import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { makeOrgCollection } from '../api/firebase/collections'
import { confirmInvitation, getProfile, inviteUser, migrateUsers } from '../api/users'
import { Role } from '../config'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { getUsersList } from '../services/users'
import { Dictionary } from '../types/dictionary'
import { InviteForm } from '../types/invite'
import { OrganizationUser, User } from '../types/user'
import { arrayToDictionary } from '../utils/common'

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
    fetchUsers: useCallback(async (orgId: string) => {
      setFetching(true)
      const resp = await getUsersList(orgId)
      const itemsById = arrayToDictionary(resp)
      setUsersById(itemsById)
      setFetching(false)
    }, []),
    // TODO: remove
    fetchOrgUser: useCallback(async (orgId: string, id: string) => {
      setFetching(true)
      const collection = makeOrgCollection<OrganizationUser>('users', orgId)
      const res = await collection.getById(id)
      setUsersById((items) => ({ ...items, [res.id]: res }))
      setFetching(false)
    }, []),
    fetchProfile: useCallback(async () => {
      try {
        setFetching(true)
        const result = await getProfile()
        setProfile(result.data)
        setFetching(false)
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
  }
}
