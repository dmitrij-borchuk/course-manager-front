import { OrganizationUser } from './user'

export type GroupBase = {
  name: string
}

export type Group = GroupBase & {
  id: string
  teacher?: string
  // TODO: remove
  schedules?: string[]
}

export type GroupFull = Omit<Group, 'teacher'> & {
  teacher?: OrganizationUser
  // students?: Student[]
  // schedules: Schedule[]
}

export type NewGroup = GroupBase
