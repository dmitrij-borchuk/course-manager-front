import { Attendance } from './attendance'
import { Group } from './group'

export type StudentBase = {
  name: string
  tags: string[]
  outerId: string
  email?: string
}

export type Student = StudentBase & {
  id: number
}

export type StudentFull = Student & {
  groups: Group[]
  attendances: Attendance[]
}

export type NewStudent = StudentBase
export type StudentImport = NewStudent
