import * as Apollo from '@apollo/client'
import { TeacherDocument, TeacherQuery, TeacherQueryVariables } from '../api'
import { UnboxMaybe } from '../types/unboxMaybe'

type Teacher = UnboxMaybe<TeacherQuery>
export function useTeacher(baseOptions: Apollo.QueryHookOptions<Teacher, TeacherQueryVariables>) {
  return Apollo.useQuery<Teacher, TeacherQueryVariables>(TeacherDocument, baseOptions)
}
