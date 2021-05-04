import { Attendance } from './attendance'
import { Group } from './group'

export type StudentBase = {
  name: string
  description?: string
}

export type Student = StudentBase & {
  id: string
  groups: string[]
  attendances: string[]
  published_at: string
  created_by: string
  updated_by: string
}

export type StudentFull = Omit<Student, 'groups' | 'attendances'> & {
  groups: Group[]
  attendances: Attendance[]
}

export type NewStudent = StudentBase
