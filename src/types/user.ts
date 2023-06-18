type UserBase = {
  username: string
  email: string
  provider?: string
  confirmed?: boolean
  blocked?: boolean
}

export type User = {
  id: number
  /**
   * @deprecated use `Profile` instead
   */
  name: string
  email: string
  outerId: string
  createdAt: string
  systemRole: string | null
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

/**
 * @deprecated use `Profile` instead
 */
export type OrganizationUser = {
  id: number
  role?: string
  name?: string
  outerId: string
}
