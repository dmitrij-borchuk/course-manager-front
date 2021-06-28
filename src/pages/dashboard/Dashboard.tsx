import { useEffect } from 'react'
import { Dashboard } from '../../components/dashboard/Dashboard'
import { useAttendanceGrouping } from '../../services/attendances'
import { useAttendancesState, useGroupsState } from '../../store'

const oneDay = 1000 * 60 * 60 * 24
const now = Date.now()
// TODO: should be updated on component mount
const fromDate = new Date(now - oneDay * 6)
const toDate = new Date(now - oneDay * 0)

export function DashboardPage() {
  const { fetchAllAttendances, attendances } = useAttendancesState()
  const { fetchGroups, groups } = useGroupsState()
  const timelineData = useAttendanceGrouping(fromDate, toDate, attendances, groups)

  useEffect(() => {
    fetchAllAttendances(fromDate, toDate)
    // TODO: Get teacher's groups in case of teacher
    fetchGroups()
  }, [fetchAllAttendances, fetchGroups])

  // TODO: loading state
  return <Dashboard items={timelineData} />
}
