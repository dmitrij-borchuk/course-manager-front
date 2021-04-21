import { UserInfo } from './userInfo'
import { Student } from './student'

export type GroupBase = {
  name: string
  description?: string
}

export type Group = GroupBase & {
  id: string
  students?: Student[]
  attendances?: {}[]
  teacher?: string
  published_at?: string
}

export type GroupFull = Omit<Group, 'teacher'> & {
  teacher?: UserInfo
}

export type NewGroup = GroupBase
