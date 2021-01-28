import * as Apollo from '@apollo/client'
import { AttendancesDocument, AttendancesQuery, AttendancesQueryVariables } from '../api'
import { UnboxMaybe } from '../types/unboxMaybe'

type Attendances = UnboxMaybe<AttendancesQuery>
export function useAttendances(baseOptions?: Apollo.QueryHookOptions<Attendances, AttendancesQueryVariables>) {
  return Apollo.useQuery<Attendances, AttendancesQueryVariables>(AttendancesDocument, baseOptions)
}
