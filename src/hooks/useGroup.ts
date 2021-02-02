import * as Apollo from '@apollo/client'
import { GroupDocument, GroupQuery, GroupQueryVariables } from '../api'
import { UnboxMaybe } from '../types/unboxMaybe'

type Group = UnboxMaybe<GroupQuery>
export function useGroup(baseOptions: Apollo.QueryHookOptions<Group, GroupQueryVariables>) {
  return Apollo.useQuery<Group, GroupQueryVariables>(GroupDocument, baseOptions)
}
