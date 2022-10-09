import { useMemo } from 'react'
import { Attendance } from '../types/attendance'
import { Dictionary } from '../types/dictionary'
import { Group } from '../types/group'
import { groupBy } from '../utils/common'

export function useAttendanceRateByGroups(groups: Group[], attendances: Attendance[]) {
  const attendancesByGroup = useMemo(() => groupBy(attendances, (a) => a.group), [attendances])
  const rateByGroup = useMemo(
    () =>
      (groups || []).reduce<Dictionary<number>>((acc, g) => {
        const attendancesOfGroup = attendancesByGroup[g.id] || []
        const classesRates = attendancesOfGroup.map((a) => getRateOfClass(a))
        const rate = getAverage(classesRates)

        if (!rate) {
          return acc
        }

        return {
          ...acc,
          [g.id]: rate,
        }
      }, {}),
    [attendancesByGroup, groups]
  )

  return rateByGroup
}

export function useStudentAttendanceRateByGroups(studentId: string, groups: Group[], attendances: Attendance[]) {
  const attendancesByGroup = useMemo(() => groupBy(attendances, (a) => a.group), [attendances])
  const rateByGroup = useMemo(
    () =>
      (groups || []).reduce<Dictionary<number>>((acc, g) => {
        const attendancesOfGroup = attendancesByGroup[g.id] || []
        const studentRate = getRateOfStudent(studentId, attendancesOfGroup)

        if (isNaN(studentRate)) {
          return acc
        }

        return {
          ...acc,
          [g.id]: studentRate,
        }
      }, {}),
    [attendancesByGroup, groups, studentId]
  )

  return rateByGroup
}

export function useAttendanceRateByTeacher(attendances: Attendance[]) {
  const attendancesByTeacher = useMemo(() => groupBy(attendances, 'teacher'), [attendances])
  const keys = Object.keys(attendancesByTeacher)
  const rateByTeacher = useMemo(
    () =>
      keys.reduce<Dictionary<number>>((acc, key) => {
        const attendances = attendancesByTeacher[key] || []
        const classesRates = attendances.map((a) => getRateOfClass(a))
        const rate = getAverage(classesRates)

        if (!rate) {
          return acc
        }

        return {
          ...acc,
          [key]: rate,
        }
      }, {}),
    [attendancesByTeacher, keys]
  )

  return rateByTeacher
}

export function useAttendanceRateByStudent(attendances: Attendance[]) {
  return useMemo(() => {
    const attendancesOfStudents: Dictionary<boolean[]> = {}
    attendances.forEach((attendance) => {
      const keys = Object.keys(attendance.attended)
      keys.forEach((key) => {
        attendancesOfStudents[key] = attendancesOfStudents[key] || []
        attendancesOfStudents[key].push(attendance.attended[key])
      })
    })
    const attendancesByStudents: Dictionary<number> = {}
    Object.entries(attendancesOfStudents).forEach(([key, values]) => {
      attendancesByStudents[key] = values.filter(Boolean).length / values.length
    })

    return attendancesByStudents
  }, [attendances])
}

function getRateOfClass(attendance: Attendance) {
  const values = Object.values(attendance.attended)
  const attended = values.filter((v) => !!v).length

  return attended / values.length
}

function getRateOfStudent(studentId: string, attendances: Attendance[]) {
  const attendancesWithStudent = attendances.filter((a) => typeof a.attended[studentId] !== 'undefined')
  const values = attendancesWithStudent.map((a) => a.attended[studentId])
  const attended = values.filter((v) => !!v).length

  return attended / values.length
}

function getAverage(values: number[]) {
  if (values.length === 0) {
    return null
  }
  return values.reduce((acc, v) => acc + v) / values.length
}
