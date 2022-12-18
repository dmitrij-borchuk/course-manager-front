import { Activity } from '../types/activity'
import request from './request'

export function migrateActivities() {
  return request.post<string>('/activities/migrate')
}

type FetchActivitiesParams = {
  performerId?: number
}
export function fetchActivities(params?: FetchActivitiesParams) {
  return request.get<Activity[]>(`/activities`, {
    params,
  })
}

export function fetchActivitiesByParticipant(id: number, date?: Date) {
  return request.get<Activity[]>(`/activities/byParticipant/${id}`, {
    params: { date },
  })
}

export function fetchActivity(id: number) {
  return request.get<Activity>(`/activities/${id}`)
}

export function deleteActivity(id: number) {
  return request.delete<Activity>(`/activities/${id}`)
}

type NewActivity = Omit<Activity, 'id'>
export function createActivity(orgId: number, data: NewActivity) {
  // TODO: implement
  throw new Error('TBD')
  // return request.post<Activity>(`/activities?orgId=${orgId}`, data)
}

export function editActivity(id: number, data: Partial<Activity>) {
  return request.put<Activity>(`/activities/${id}`, data)
}

export function assignParticipant(groupId: number, participantId: number) {
  return request.post<void>(`/activities/${groupId}/participant/${participantId}`)
}

export function unassignParticipant(groupId: number, participantId: number) {
  return request.delete<void>(`/activities/${groupId}/participant/${participantId}`)
}
