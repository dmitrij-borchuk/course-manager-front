export type Profile = {
  id: number
  deleted: boolean
  name: string
  role: string
  updatedAt: string
  createdAt: string
  organizationId: number
  userId: number
  updatedBy: number
  user: {
    id: number
    email: string
    outerId: string
  }
}
