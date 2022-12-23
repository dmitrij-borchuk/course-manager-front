import { OrganizationUser } from './user'

// TODO: probably we need to remove this file

export type GroupBase = {
  name: string
}

// TODO: remove
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
