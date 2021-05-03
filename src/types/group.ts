import { UserInfo } from './userInfo'
import { Student } from './student'

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
}

export type GroupFull = Omit<Group, 'teacher' | 'students'> & {
  teacher?: UserInfo
  students?: Student[]
}

export type NewGroup = GroupBase
