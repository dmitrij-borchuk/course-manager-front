import request from './request'
import { NewSchedule, Schedule, ScheduleFull } from '../types/Schedule'

export function createScheduleRequest(data: NewSchedule) {
  return request.post<ScheduleFull>(`/schedules`, data)
}

export function editScheduleRequest(data: Schedule) {
  return request.put<ScheduleFull>(`/schedules/${data.id}`, data)
}
