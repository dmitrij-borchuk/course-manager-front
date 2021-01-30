import { useMemo } from 'react'
import { AttendancesQuery, GroupsQuery } from '../api'
import { AttendanceItem } from '../types/attendance'
import { GroupItem } from '../types/group'
import { UnboxMaybe } from '../types/unboxMaybe'
import { groupBy } from '../utils/common'
import { datesInRange } from '../utils/date'

type Attendances = UnboxMaybe<AttendancesQuery['attendances']>
type Groups = UnboxMaybe<GroupsQuery['groups']>

export function useAttendanceGrouping(from: Date, to: Date, attendances?: Attendances, groups?: Groups) {
  return useMemo(() => {
    if (!attendances || !groups) {
      return []
    }

    return getTimelineData(from, to, attendances, groups)
  }, [attendances, groups, from, to])
}

function getAttendanceDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}}`
}
function getTimelineData(from: Date, to: Date, attendances: AttendanceItem[], groups: GroupItem[]) {
  const attByDate = groupBy(attendances, (att) => {
    const date = new Date(att.date)
    return getAttendanceDateKey(date)
  })
  const days = datesInRange(from, to)

  return days.map((day) => {
    return getBlockData(new Date(day), attByDate[getAttendanceDateKey(day)] || [], groups)
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
