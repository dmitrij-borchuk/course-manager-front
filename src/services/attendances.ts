import { useMemo } from 'react'
import { addAttendanceRequest, getAttendancesRequest, removeAttendanceRequest } from '../api/attendances'
import { AttendanceFull, AttendanceNew } from '../types/attendance'
import { Group } from '../types/group'
import { groupBy } from '../utils/common'
import { datesInRange } from '../utils/date'
import { getClassesDates } from '../utils/schedule'

export function useAttendanceGrouping(from: Date, to: Date, attendances?: AttendanceFull[], groups?: Group[]) {
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
function getTimelineData(from: Date, to: Date, attendances: AttendanceFull[], groups: Group[]) {
  const attByDate = groupBy(attendances, (att) => {
    const date = new Date(att.date)
    return getAttendanceDateKey(date)
  })
  const days = datesInRange(from, to).reverse()

  return days.map((day) => {
    return getBlockData(new Date(day), attByDate[getAttendanceDateKey(day)] || [], groups)
  })
}

function getBlockData(date: Date, attendances: AttendanceFull[], groups: Group[]) {
  const attByGroup = groupBy(attendances, (v) => v.group?.id)

  const items = groups.map((g) => {
    const [start, end] = getDayRanges(date)
    const classes = getClassesDates(g, end, start)
    if (classes.length) {
      return getMeterData(attByGroup[g.id], g)
    }

    return null
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

function getDayRanges(date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return [start, end]
}

function getMeterData(attendances: AttendanceFull[], group: Group) {
  return { id: group.id, text: group.name, progress: getMeterProgress(attendances, group) }
}

function getMeterProgress(attendances: AttendanceFull[], group: Group) {
  // TODO: remove duplications in `attendancesOfGroup` items (if one student was registered two times)
  const groupAtt = attendances?.length
  // const groupMembers = group.students?.length
  const groupMembers = 0
  if (!groupAtt || !groupMembers) {
    return 0
  }

  return groupAtt / groupMembers
}

export function fetchAllAttendances(from: Date, to: Date) {
  const fromDate = from.toISOString()
  const toDate = to.toISOString()

  return getAttendancesRequest(`date_gte=${fromDate}&date_lte=${toDate}`)
}

export function fetchAttendancesForStudent(groupsIds: string[], studentId: string) {
  const groupInParam = groupsIds.map((g) => `group_in=${g}`).join('&')

  return getAttendancesRequest(`student=${studentId}&${groupInParam}`)
}

export function fetchAttendances(groupsIds: string[], studentsIds: string[]) {
  const groupInParam = groupsIds.map((g) => `group_in=${g}`).join('&')
  const studentInParam = studentsIds.map((s) => `student_in=${s}`).join('&')

  return getAttendancesRequest(
    `${studentsIds.length ? `${studentInParam}&` : ''}${groupsIds.length ? `${groupInParam}&` : ''}`
  )
}

export function addAttendances(attendances: AttendanceNew[]) {
  return Promise.allSettled(attendances.map((a) => addAttendanceRequest(a)))
}

export function removeAttendances(attendancesIds: string[]) {
  return Promise.allSettled(attendancesIds.map((id) => removeAttendanceRequest(id)))
}
