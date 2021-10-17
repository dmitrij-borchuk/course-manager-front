import { useMemo } from 'react'
import { Attendance } from '../types/attendance'
import { Group } from '../types/group'
import { arrayToDictionary, groupBy } from '../utils/common'
import { datesInRange } from '../utils/date'

export function useAttendanceGrouping(from: Date, to: Date, attendances?: Attendance[], groups?: Group[]) {
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
function getTimelineData(from: Date, to: Date, attendances: Attendance[], groups: Group[]) {
  const attByDate = groupBy(attendances, (att) => {
    const date = new Date(att.date)
    return getAttendanceDateKey(date)
  })
  const days = datesInRange(from, to).reverse()

  return days.map((day) => {
    return getBlockData(new Date(day), attByDate[getAttendanceDateKey(day)] || [], groups)
  })
}

function getBlockData(date: Date, attendances: Attendance[], groups: Group[]) {
  const groupsById = arrayToDictionary(groups)
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

function getMeterData(attendance: Attendance, group: Group) {
  return { id: attendance.id, text: group.name, progress: getMeterProgress(attendance, group) }
}

function getMeterProgress(attendance: Attendance, group: Group) {
  const groupMembers = Object.keys(attendance.attended).length
  const groupAtt = Object.values(attendance.attended).filter(Boolean).length

  return groupAtt / groupMembers
}
