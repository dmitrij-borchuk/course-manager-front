import { UserInfo } from './userInfo'

type UserBase = {
  username: string
  email: string
  provider?: string
  confirmed?: boolean
  blocked?: boolean
}

export type User = UserBase & {
  id: string
  role?: {}
  user_info?: UserInfo
}

export type NewUser = UserBase & {
  password?: string
  role: string
  user_info?: string
}
