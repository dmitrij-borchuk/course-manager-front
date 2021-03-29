import { Attendance } from './attendance'
import { Group } from './group'

export type Student = {
  id: string
  name: string
  description?: string
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
