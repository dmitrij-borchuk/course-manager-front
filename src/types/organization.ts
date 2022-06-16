export type OrganizationFirebase = {
  id: string
  name: string
  creator: string
}
export type Organization = {
  id: string
  key: string
  name: string
  owner: number
  role: string
  updatedBy: number
  createdAt: string
  updatedAt: string
}

export type OrganizationEdit = Pick<Organization, 'id' | 'key' | 'name'>

export type OrganizationCreate = Pick<Organization, 'key' | 'name'>
