import { Group } from './group'
import { Student } from './student'

export type Attendance = {
  id: string
  student?: string
  group?: string
  date: string
  published_at?: string
}

export type AttendanceFull = Omit<Attendance, 'student' | 'group'> & {
  student?: Student
  group?: Group
}
