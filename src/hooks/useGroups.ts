import * as Apollo from '@apollo/client'
import { GroupsDocument, GroupsQuery, GroupsQueryVariables } from '../api'
import { UnboxMaybe } from '../types/unboxMaybe'

type Groups = UnboxMaybe<GroupsQuery>
export function useGroups(baseOptions?: Apollo.QueryHookOptions<Groups, GroupsQueryVariables>) {
  return Apollo.useQuery<Groups, GroupsQueryVariables>(GroupsDocument, baseOptions)
}
