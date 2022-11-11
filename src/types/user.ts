type UserBase = {
  username: string
  email: string
  provider?: string
  confirmed?: boolean
  blocked?: boolean
}

export type User = {
  id: number
  name: string
  email: string
  outerId: string
  createdAt: string
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

// TODO: do we need it?
export type AppUser = {
  name?: string
  avatar?: string
}

export type OrganizationUser = {
  id: number
  role?: string
  name?: string
  outerId: string
}
