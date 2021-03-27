import { User } from './user'

type UserInfoBase = {
  name: string
  description?: string
  groups?: string[]
}
export type NewUserInfo = UserInfoBase & {
  user: string
}
export type UserInfoFull = UserInfoBase & {
  id: string
  user?: User
  created_by?: string
  updated_by?: string
}
export type UserInfo = Omit<UserInfoFull, 'user'> & {
  user?: string
}
