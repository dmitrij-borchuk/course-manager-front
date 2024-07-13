import { useMemo } from 'react'
import { Profile } from 'types/profile'
import { Activity } from '../types/activity'
import { Attendance } from '../types/attendance'
import { groupBy } from '../utils/common'
import { datesInRange } from '../utils/date'
import { ActivityWithParticipationAndPerformer } from 'modules/activities/api'

export function useAttendanceGrouping(
  from: Date,
  to: Date,
  attendances?: Attendance[],
  groups?: ActivityWithParticipationAndPerformer[]
) {
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
function getTimelineData(
  from: Date,
  to: Date,
  attendances: Attendance[],
  groups: ActivityWithParticipationAndPerformer[]
) {
  const attByDate = groupBy(attendances, (att) => {
    const date = new Date(att.date)
    return getAttendanceDateKey(date)
  })
  const days = datesInRange(from, to).reverse()

  return days.map((day) => {
    return getBlockData(new Date(day), attByDate[getAttendanceDateKey(day)] || [], groups)
  })
}

function getBlockData(date: Date, attendances: Attendance[], groups: ActivityWithParticipationAndPerformer[]) {
  const groupsById = groups.reduce<Record<string, ActivityWithParticipationAndPerformer>>((acc, group) => {
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
    items: items.filter(filterOutNull),
  }
}
function filterOutNull<T>(d: T | null): d is T {
  return !!d
}

function getMeterData(
  attendance: Attendance,
  group: ActivityWithParticipationAndPerformer
): {
  id: string
  activity: Activity
  performer?: Profile
  rate?: number
  studentsNumber?: number
} {
  return {
    id: attendance.id,
    activity: group,
    rate: getMeterProgress(attendance),
    // TODO: get exact user profile
    performer: group.performer.organizationsConnected[0],
    studentsNumber: getParticipantCount(attendance),
  }
}

export function getMeterProgress(attendance: Attendance) {
  const groupMembers = Object.keys(attendance.attended).length
  const groupAtt = Object.values(attendance.attended).filter(Boolean).length

  return groupMembers === 0 ? 0 : groupAtt / groupMembers
}

export function getParticipantCount(attendance: Attendance) {
  return Object.keys(attendance.attended).length
}

export function getAttendanceRate(attendance: Attendance) {
  const groupMembers = Object.keys(attendance.attended).length
  const groupAtt = Object.values(attendance.attended).filter(Boolean).length

  return groupMembers === 0 ? 0 : groupAtt / groupMembers
}

export function getAttendanceStatisticOfParticipant(participantOuterId: string, attendances: Attendance[]) {
  const relevantAttendances = attendances.filter((a) => a.attended[participantOuterId] !== undefined)
  const attended = relevantAttendances.reduce((acc, att) => {
    return acc + (att.attended[participantOuterId] ? 1 : 0)
  }, 0)

  return {
    all: relevantAttendances.length,
    attended,
    rate: relevantAttendances.length === 0 ? null : attended / relevantAttendances.length,
  }
}
