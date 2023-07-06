import { User } from './user'

export type OrganizationFirebase = {
  id: string
  name: string
  creator: string
}
export type Organization = {
  id: number
  key: string
  name: string
  owner: number
  role: string
  updatedBy: number
  createdAt: string
  updatedAt: string
  userId: number
  organizationId: number
}

export type OrganizationEdit = Pick<Organization, 'id' | 'key' | 'name'>

export type OrganizationCreate = Pick<Organization, 'key' | 'name'>

export type InviteInfo = {
  organization: {
    name: string
  }
  invite: {
    role: string
    updatedBy: User
  }
}
