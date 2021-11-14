import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { makeOrgCollection } from '../api/firebase/collections'
import { Role } from '../config'
import { useDictionaryToArray } from '../hooks/useDictionaryToArray'
import { confirmInvitation, getUsersList, inviteUser } from '../services/users'
import { Dictionary } from '../types/dictionary'
import { Invite } from '../types/invite'
import { OrganizationUser } from '../types/user'
import { arrayToDictionary } from '../utils/common'

export default function useUsersStore() {
  const history = useHistory()
  const [usersById, setUsersById] = useState<Dictionary<OrganizationUser>>({})
  const users = useDictionaryToArray(usersById)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<Error>()
  const [fetching, setFetching] = useState(false)

  return {
    submitting,
    error,
    fetching,
    usersById,
    users,
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
      async (orgId: string, userId: string, token: string, role: Role) => {
        setSubmitting(true)
        try {
          await confirmInvitation(orgId, userId, token, role)
          setSubmitting(false)

          history.push(`/${orgId}/`)
        } catch (error: any) {
          setError(error)
          setSubmitting(false)
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
    fetchOrgUser: useCallback(async (orgId: string, id: string) => {
      setFetching(true)
      const collection = makeOrgCollection<OrganizationUser>('users', orgId)
      const res = await collection.getById(id)
      setUsersById((items) => ({ ...items, [res.id]: res }))
      setFetching(false)
    }, []),
  }
}
