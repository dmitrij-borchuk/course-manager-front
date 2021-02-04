import * as Apollo from '@apollo/client'
import { TeachersDocument, TeachersQuery, TeachersQueryVariables } from '../api'
import { UnboxMaybe } from '../types/unboxMaybe'

type Teachers = UnboxMaybe<TeachersQuery>
export function useTeachers(baseOptions?: Apollo.QueryHookOptions<Teachers, TeachersQueryVariables>) {
  return Apollo.useQuery<Teachers, TeachersQueryVariables>(TeachersDocument, {
    ...baseOptions,
    variables: {
      ...baseOptions?.variables,
      where: { role: { name: 'Teacher' } },
    },
  })
}
