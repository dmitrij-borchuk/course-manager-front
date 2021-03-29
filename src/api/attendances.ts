import { AttendanceFull } from '../types/attendance'
import request from './request'

export function getAttendancesRequest(params?: string) {
  return request.get<AttendanceFull[]>(`/attendances?${params || ''}`)
}
