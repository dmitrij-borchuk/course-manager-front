import { UserInfo } from './userInfo'
import { Student } from './student'

export type Group = {
  id: string
  name: string
  description?: string
  students?: Student[]
  attendances?: {}[]
  teacher?: string
  published_at?: string
}

export type GroupFull = Omit<Group, 'teacher'> & {
  teacher?: UserInfo
}
