import { Attendance } from './attendance'
import { Group } from './group'

export type StudentBase = {
  name: string
  description?: string
}

export type Student = StudentBase & {
  id: string
}

export type StudentFull = Student & {
  groups: Group[]
  attendances: Attendance[]
}

export type NewStudent = StudentBase
