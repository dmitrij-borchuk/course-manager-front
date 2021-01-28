import { GroupsQuery } from '../api'
import { UnboxMaybe } from './unboxMaybe'
import { UnboxArray } from './unboxArray'

export type GroupItem = UnboxArray<UnboxMaybe<GroupsQuery['groups']>>
