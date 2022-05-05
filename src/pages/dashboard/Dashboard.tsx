import { useCallback, useEffect, useMemo } from 'react'
import { useToasts } from 'react-toast-notifications'
import { Dashboard } from '../../components/dashboard/Dashboard'
import { Loader } from '../../components/kit/loader/Loader'
import { ROLES } from '../../config'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendanceGrouping } from '../../services/attendances'
import { useAttendancesState, useGroupsState } from '../../store'

const oneDay = 1000 * 60 * 60 * 24

export function DashboardPage() {
  const {
    fetchAllAttendances,
    fetchAttendancesForTeacher,
    attendances,
    clearAttendances,
    loading: loadingAttendances,
  } = useAttendancesState()
  const { addToast } = useToasts()
  const { fetchGroups, fetchGroupsOfTeacher, groups, fetching: fetchingGroups } = useGroupsState()
  const { organizationUser, loading: userLoading } = useCurrentUser()
  const now = useMemo(() => Date.now(), [])
  const fromDate = useMemo(() => new Date(now - oneDay * 6), [now])
  const toDate = useMemo(() => new Date(now - oneDay * 0), [now])
  const timelineData = useAttendanceGrouping(fromDate, toDate, attendances, groups)
  const orgId = useOrgId()
  const isLoading = loadingAttendances || fetchingGroups || userLoading
  const fetchAttendances = useCallback(async () => {
    if (!organizationUser) {
      return
    }

    try {
      if (organizationUser.role === ROLES.Administrator) {
        await fetchAllAttendances(orgId, fromDate, toDate)
      } else {
        await fetchAttendancesForTeacher(orgId, organizationUser.id, fromDate, toDate)
      }
    } catch (error: any) {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }, [addToast, fetchAllAttendances, fetchAttendancesForTeacher, fromDate, orgId, organizationUser, toDate])
  const fetchNeededGroups = useCallback(async () => {
    if (!organizationUser) {
      return
    }
    try {
      if (organizationUser.role === ROLES.Administrator) {
        await fetchGroups(orgId)
      } else {
        await fetchGroupsOfTeacher(orgId, organizationUser.id)
      }
    } catch (error: any) {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      })
    }
  }, [addToast, fetchGroups, fetchGroupsOfTeacher, orgId, organizationUser])

  useEffect(() => {
    fetchAttendances()

    return () => {
      clearAttendances()
    }
  }, [clearAttendances, fetchAttendances])

  useEffect(() => {
    fetchNeededGroups()
  }, [fetchNeededGroups])

  return (
    <Loader show={isLoading}>
      <Dashboard items={timelineData} />
    </Loader>
  )
}
