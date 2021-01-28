import { useMemo } from 'react'
import { groupBy } from '../../utils/common'
import { AttendancesQuery, GroupsQuery } from '../../api'
import { UnboxMaybe } from '../../types/unboxMaybe'
import { AttendanceItem } from '../../types/attendance'
import { GroupItem } from '../../types/group'
import { useAttendances } from '../../hooks/useAttendances'
import { useGroups } from '../../hooks/useGroups'
import { Dashboard } from '../../components/dashboard/Dashboard'

const date = new Date()
const oneDay = 1000 * 60 * 60 * 24
const dates = [
  date,
  new Date(date.getTime() + oneDay * 1),
  new Date(date.getTime() + oneDay * 2),
  new Date(date.getTime() + oneDay * 3),
]
export function DashboardPage() {
  const { data: attendancesRes, loading: attendancesLoading } = useAttendances({
    variables: {
      where: {
        date_gte: dates[0].toISOString(),
        date_lte: dates[dates.length - 1].toISOString(),
      },
    },
  })
  const { data: groupsRes, loading: groupsLoading } = useGroups({})
  const timelineData = useAttendanceGrouping(attendancesRes?.attendances, groupsRes?.groups)
  console.log('=-= timelineData', timelineData)

  // TODO: loading state
  return <Dashboard items={timelineData} />
}

type Attendances = UnboxMaybe<AttendancesQuery['attendances']>
type Groups = UnboxMaybe<GroupsQuery['groups']>

// TODO: move to service
function useAttendanceGrouping(attendances?: Attendances, groups?: Groups) {
  return useMemo(() => {
    if (!attendances || !groups) {
      return []
    }

    return getTimelineData(attendances, groups)
  }, [attendances, groups])
}

function getTimelineData(attendances: AttendanceItem[], groups: GroupItem[]) {
  const attByDate = groupBy(attendances, 'date')

  return Object.entries(attByDate).map(([date, attendances]) => {
    return getBlockData(new Date(date), attendances, groups)
  })
}

function getBlockData(date: Date, attendances: AttendanceItem[], groups: GroupItem[]) {
  const attByGroup = groupBy(attendances, (v) => v.group?.id)
  const groupsById = groupBy(groups, 'id')

  const items = Object.entries(attByGroup).map(([groupId, attendances]) => {
    return getMeterData(attendances, groupsById[groupId][0])
  })

  return {
    date,
    items,
  }
}

function getMeterData(attendances: AttendanceItem[], group: GroupItem) {
  return { id: group.id, text: group.name, progress: getMeterProgress(attendances, group) }
}

function getMeterProgress(attendances: AttendanceItem[], group: GroupItem) {
  // TODO: remove duplications in `attendancesOfGroup` items (if one student was registered two times)
  const groupAtt = attendances?.length
  const groupMembers = group.students?.length
  if (!groupAtt || !groupMembers) {
    return 0
  }

  return groupAtt / groupMembers
}
