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

// TODO: do we need it?
export type NewUser = UserBase & {
  password?: string
  role: string
  user_info?: string
}

export type UserMetadata = {
  id: string
  name: string
  email?: string
  organizations?: string[]
}

export type AppUser = {
  name?: string
  avatar?: string
}

export type OrganizationUser = {
  id: string
  role?: string
  name?: string
}
