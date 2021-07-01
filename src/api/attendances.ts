import { AttendanceFull, AttendanceNew } from '../types/attendance'
import request from './request'

export function getAttendancesRequest(params?: string) {
  return request.get<AttendanceFull[]>(`/attendances?${params || ''}`)
}

export function addAttendanceRequest(data: AttendanceNew) {
  return request.post<AttendanceFull>(`/attendances`, data)
}

export function removeAttendanceRequest(id: string) {
  return request.delete<AttendanceFull>(`/attendances/${id}`)
}
