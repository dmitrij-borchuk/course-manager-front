import { useCallback, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useOrgId } from '../../hooks/useOrgId'
import useUsersStore from '../../store/usersStore'
import { UsersList } from '../../components/users/UsersList'

export const UsersListPage = () => {
  const { users, fetchUsers, fetching } = useUsersStore()
  const orgId = useOrgId()
  const { addToast } = useToasts()
  const fetchList = useCallback(async () => {
    if (!orgId) {
      throw new Error('Organization name not found')
    }
    try {
      await fetchUsers(orgId)
    } catch (error: any) {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }, [addToast, fetchUsers, orgId])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  return <UsersList items={users} loading={fetching} />
}
