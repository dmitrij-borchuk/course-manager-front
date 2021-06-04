import { UserInfo } from './userInfo'
import { Student } from './student'
import { Schedule } from './Schedule'

export type GroupBase = {
  name: string
  description?: string
}

export type Group = GroupBase & {
  id: string
  students?: string[]
  attendances?: {}[]
  teacher?: string
  published_at?: string
  schedules: string[]
}

export type GroupFull = Omit<Group, 'teacher' | 'students' | 'schedules'> & {
  teacher?: UserInfo
  students?: Student[]
  schedules: Schedule[]
}

export type NewGroup = GroupBase
