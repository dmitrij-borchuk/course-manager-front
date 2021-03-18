import { User } from './user'

type UserInfoBase = {
  name: string
  description?: string
}
export type NewUserInfo = UserInfoBase & {
  groups?: string[]
  user: string
}
export type UserInfo = UserInfoBase & {
  groups?: {}
  user?: User
  created_by?: string
  updated_by?: string
}
