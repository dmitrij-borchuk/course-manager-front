import { Dictionary } from './dictionary'

export type AttendanceBase = {
  // In milliseconds in UTC
  date: number
  attended: Dictionary<boolean>
  group: string
  teacher: string
}

export type AttendanceNew = AttendanceBase

export type Attendance = AttendanceBase & {
  id: string
}
