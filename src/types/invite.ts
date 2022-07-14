export type InviteResponse = {
  id: string
  email: string
  role: string
  token: string
  organization: number
  dueTo: string
  createdAt: string
  updatedAt: string
  updatedBy: number
}

export type InviteForm = {
  email: string
}
