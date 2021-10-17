import { useEffect, useMemo } from 'react'
import { Dashboard } from '../../components/dashboard/Dashboard'
import { useOrgId } from '../../hooks/useOrgId'
import { useAttendanceGrouping } from '../../services/attendances'
import { useAttendancesState, useGroupsState } from '../../store'

const oneDay = 1000 * 60 * 60 * 24

export function DashboardPage() {
  const { fetchAllAttendances, attendances } = useAttendancesState()
  const { fetchGroups, groups } = useGroupsState()
  const now = useMemo(() => Date.now(), [])
  const fromDate = useMemo(() => new Date(now - oneDay * 6), [now])
  const toDate = useMemo(() => new Date(now - oneDay * 0), [now])
  const timelineData = useAttendanceGrouping(fromDate, toDate, attendances, groups)
  const orgId = useOrgId()

  useEffect(() => {
    fetchAllAttendances(orgId, fromDate, toDate)
    // TODO: Get teacher's groups in case of teacher
    fetchGroups(orgId)
  }, [fetchAllAttendances, fetchGroups, fromDate, orgId, toDate])

  // TODO: loading state
  return <Dashboard items={timelineData} />
}
