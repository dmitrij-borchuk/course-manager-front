import { GroupsQuery } from '../api'
import { UnboxMaybe } from './unboxMaybe'
import { UnboxArray } from './unboxArray'
import { UserInfo } from './userInfo'

// TODO: remove
export type GroupItem = UnboxArray<UnboxMaybe<GroupsQuery['groups']>>

export type Group = {
  id: string
  name: string
  description?: string
  students?: {}[]
  attendances?: {}[]
  teacher?: UserInfo
  published_at?: string
}
