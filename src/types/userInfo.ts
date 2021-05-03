import { Group } from './group'
import { User } from './user'

type UserInfoBase = {
  name: string
  description?: string
}
export type NewUserInfo = UserInfoBase & {
  user: string
}
export type UserInfoFull = UserInfoBase & {
  id: string
  user?: User
  created_by?: string
  updated_by?: string
  groups?: Group[]
}
export type UserInfo = Omit<UserInfoFull, 'user' | 'groups'> & {
  user?: string
  groups?: string[]
}
