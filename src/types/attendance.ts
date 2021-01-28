import { AttendancesQuery } from '../api'
import { UnboxMaybe } from './unboxMaybe'
import { UnboxArray } from './unboxArray'

export type AttendanceItem = UnboxArray<UnboxMaybe<AttendancesQuery['attendances']>>
