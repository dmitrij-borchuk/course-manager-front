import { User } from './user'

export type Role = {
  id: string
  name: string
  description?: string
  type?: string
  permissions?: {
    id: string
    type: string
    controller: string
    action: string
    enabled: boolean
    policy: string
    role: string
    created_by: string
    updated_by: string
  }[]
  users: User[]
}
