import { useMemo } from 'react'
import { Activity } from '../types/activity'
import { Attendance } from '../types/attendance'
import { groupBy } from '../utils/common'
import { datesInRange } from '../utils/date'

export function useAttendanceGrouping(from: Date, to: Date, attendances?: Attendance[], groups?: Activity[]) {
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
function getTimelineData(from: Date, to: Date, attendances: Attendance[], groups: Activity[]) {
  const attByDate = groupBy(attendances, (att) => {
    const date = new Date(att.date)
    return getAttendanceDateKey(date)
  })
  const days = datesInRange(from, to).reverse()

  return days.map((day) => {
    return getBlockData(new Date(day), attByDate[getAttendanceDateKey(day)] || [], groups)
  })
}

function getBlockData(date: Date, attendances: Attendance[], groups: Activity[]) {
  const groupsById = groups.reduce<Record<string, Activity>>((acc, group) => {
    acc[group.outerId] = group
    return acc
  }, {})

  const items = attendances.map((a) => {
    if (!groupsById[a.group]) {
      return null
    }
    return getMeterData(a, groupsById[a.group])
  })
  return {
    date,
    items: items.filter(Boolean) as unknown as {
      id: string
      text: string
      progress: number
    }[],
  }
}

function getMeterData(attendance: Attendance, group: Activity) {
  return { id: attendance.id, text: group.name, progress: getMeterProgress(attendance) }
}

function getMeterProgress(attendance: Attendance) {
  const groupMembers = Object.keys(attendance.attended).length
  const groupAtt = Object.values(attendance.attended).filter(Boolean).length

  return groupMembers === 0 ? 0 : groupAtt / groupMembers
}
