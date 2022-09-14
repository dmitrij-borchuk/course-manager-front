import { Group } from './group'
import { User } from './user'

type UserInfoBase = {
  name: string
  description?: string
}
// TODO: do weed it?
export type UserInfoFull = UserInfoBase & {
  id: string
  user?: User
  created_by?: string
  updated_by?: string
  groups?: Group[]
}
