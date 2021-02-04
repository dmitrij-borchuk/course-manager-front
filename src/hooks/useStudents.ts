import * as Apollo from '@apollo/client'
import { StudentsDocument, StudentsQuery, StudentsQueryVariables } from '../api'
import { UnboxMaybe } from '../types/unboxMaybe'

type Students = UnboxMaybe<StudentsQuery>
export function useStudents(baseOptions?: Apollo.QueryHookOptions<Students, StudentsQueryVariables>) {
  return Apollo.useQuery<Students, StudentsQueryVariables>(StudentsDocument, baseOptions)
}
