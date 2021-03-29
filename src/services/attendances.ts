import { useMemo } from 'react'
import { getAttendancesRequest } from '../api/attendances'
import { AttendanceFull } from '../types/attendance'
import { GroupFull } from '../types/group'
import { groupBy } from '../utils/common'
import { datesInRange } from '../utils/date'

export function useAttendanceGrouping(from: Date, to: Date, attendances?: AttendanceFull[], groups?: GroupFull[]) {
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
function getTimelineData(from: Date, to: Date, attendances: AttendanceFull[], groups: GroupFull[]) {
  const attByDate = groupBy(attendances, (att) => {
    const date = new Date(att.date)
    return getAttendanceDateKey(date)
  })
  const days = datesInRange(from, to).reverse()

  return days.map((day) => {
    return getBlockData(new Date(day), attByDate[getAttendanceDateKey(day)] || [], groups)
  })
}

function getBlockData(date: Date, attendances: AttendanceFull[], groups: GroupFull[]) {
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

function getMeterData(attendances: AttendanceFull[], group: GroupFull) {
  return { id: group.id, text: group.name, progress: getMeterProgress(attendances, group) }
}

function getMeterProgress(attendances: AttendanceFull[], group: GroupFull) {
  // TODO: remove duplications in `attendancesOfGroup` items (if one student was registered two times)
  const groupAtt = attendances?.length
  const groupMembers = group.students?.length
  if (!groupAtt || !groupMembers) {
    return 0
  }

  return groupAtt / groupMembers
}

export function fetchAttendances(from: Date, to: Date) {
  const fromDate = from.toISOString()
  const toDate = to.toISOString()

  return getAttendancesRequest(`date_gte=${fromDate}&date_lte=${toDate}`)
}
