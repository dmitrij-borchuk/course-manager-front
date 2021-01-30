import { useAttendances } from '../../hooks/useAttendances'
import { useGroups } from '../../hooks/useGroups'
import { Dashboard } from '../../components/dashboard/Dashboard'
import { useAttendanceGrouping } from '../../services/attendances'

const oneDay = 1000 * 60 * 60 * 24
const now = Date.now()
const fromDate = new Date(now - oneDay * 6)
const toDate = new Date(now - oneDay * 0)

export function DashboardPage() {
  const { data: attendancesRes, loading: attendancesLoading } = useAttendances({
    variables: {
      where: {
        date_gte: fromDate,
        date_lte: toDate,
      },
    },
  })
  const { data: groupsRes, loading: groupsLoading } = useGroups({})
  const timelineData = useAttendanceGrouping(fromDate, toDate, attendancesRes?.attendances, groupsRes?.groups)

  // TODO: loading state
  return <Dashboard items={timelineData} />
}
