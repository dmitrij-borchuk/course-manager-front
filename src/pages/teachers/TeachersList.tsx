import { useCallback, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import { useOrgId } from '../../hooks/useOrgId'
import { TeachersList } from '../../components/teachers/TeachersList'
import { useTeachersState } from '../../store'

export const TeachersListPage = () => {
  const { teachers, fetchTeachers, fetching } = useTeachersState()
  const orgId = useOrgId()
  const { addToast } = useToasts()
  const fetchList = useCallback(async () => {
    if (!orgId) {
      throw new Error('Organization name not found')
    }
    try {
      await fetchTeachers(orgId)
    } catch (error: any) {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }, [addToast, fetchTeachers, orgId])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  return <TeachersList items={teachers} loading={fetching} />
}
