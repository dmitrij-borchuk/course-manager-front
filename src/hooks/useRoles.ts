import * as Apollo from '@apollo/client'
import { RolesDocument, RolesQuery, RolesQueryVariables } from '../api'
import { UnboxMaybe } from '../types/unboxMaybe'

type Roles = UnboxMaybe<RolesQuery>
export function useRoles(baseOptions?: Apollo.QueryHookOptions<Roles, RolesQueryVariables>) {
  return Apollo.useQuery<Roles, RolesQueryVariables>(RolesDocument, baseOptions)
}
