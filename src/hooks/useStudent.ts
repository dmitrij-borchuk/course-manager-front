import * as Apollo from '@apollo/client'
import { StudentDocument, StudentQuery, StudentQueryVariables } from '../api'
import { UnboxMaybe } from '../types/unboxMaybe'

type Student = UnboxMaybe<StudentQuery>
export function useStudent(baseOptions: Apollo.QueryHookOptions<Student, StudentQueryVariables>) {
  return Apollo.useQuery<Student, StudentQueryVariables>(StudentDocument, baseOptions)
}
