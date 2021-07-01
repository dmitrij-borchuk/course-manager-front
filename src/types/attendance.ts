import { Group } from './group'
import { Student } from './student'

export type AttendanceBase = {
  student?: string
  group?: string
  date: string
}

export type AttendanceNew = AttendanceBase

export type Attendance = AttendanceBase & {
  id: string
  published_at?: string
}

export type AttendanceFull = Omit<Attendance, 'student' | 'group'> & {
  student?: Student
  group?: Group
}
