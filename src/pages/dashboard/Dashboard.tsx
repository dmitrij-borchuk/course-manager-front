import { useEffect, useMemo } from 'react'
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
  const { fetchGroups, fetchGroupsOfTeacher, groups, fetching: fetchingGroups } = useGroupsState()
  const { organizationUser, loading: userLoading } = useCurrentUser()
  const now = useMemo(() => Date.now(), [])
  const fromDate = useMemo(() => new Date(now - oneDay * 6), [now])
  const toDate = useMemo(() => new Date(now - oneDay * 0), [now])
  const timelineData = useAttendanceGrouping(fromDate, toDate, attendances, groups)
  const orgId = useOrgId()
  const isLoading = loadingAttendances || fetchingGroups || userLoading

  useEffect(() => {
    if (!organizationUser) {
      return
    }
    if (organizationUser.role === ROLES.Administrator) {
      fetchAllAttendances(orgId, fromDate, toDate)
    } else {
      fetchAttendancesForTeacher(orgId, organizationUser.id, fromDate, toDate)
    }

    return () => {
      clearAttendances()
    }
  }, [clearAttendances, fetchAllAttendances, fetchAttendancesForTeacher, fromDate, orgId, organizationUser, toDate])

  useEffect(() => {
    if (!organizationUser) {
      return
    }
    if (organizationUser.role === ROLES.Administrator) {
      fetchGroups(orgId)
    } else {
      fetchGroupsOfTeacher(orgId, organizationUser.id)
    }
  }, [fetchGroups, fetchGroupsOfTeacher, orgId, organizationUser])

  return (
    <Loader show={isLoading}>
      <Dashboard items={timelineData} />
    </Loader>
  )
}
