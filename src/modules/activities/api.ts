import { Profile } from 'types/profile'
import { Activity, NewActivity } from '../../types/activity'
import request from '../../api/request'

export function migrateActivities() {
  return request.post<string>('/activities/migrate')
}

type FetchActivitiesParams = {
  performerId?: number
  archived?: 'true' | 'false' | 'all'
  deleted?: 'true' | 'false' | 'all'
  participantId?: number
  date?: Date
}
export function fetchActivities(params?: FetchActivitiesParams) {
  return request.get<Activity[]>(`/activities`, {
    params,
  })
}

type FetchParticipationParamsParams = {
  activityId?: number
  archived?: 'true' | 'false' | 'all'
  deleted?: 'true' | 'false' | 'all'
  participantId?: number
  date?: Date
}
export function fetchParticipation(params?: FetchParticipationParamsParams) {
  return request.get<ParticipationRecord[]>(`/activities/participation`, {
    params,
  })
}
export type ParticipationRecord = {
  id: number
  activity: Activity
  startDate: string
  endDate: string
  participantId: number
  leaveReasonComment?: string
}

export function fetchActivity(id: number) {
  return request.get<
    Activity & {
      performer: Profile
    }
  >(`/activities/${id}`)
}

export function deleteActivity(id: number) {
  return request.delete<Activity>(`/activities/${id}`)
}

export function createActivity(data: NewActivity) {
  return request.post<Activity>(`/activities`, data)
}

export function editActivity(id: number, data: Partial<Activity>) {
  return request.put<Activity>(`/activities/${id}`, data)
}

export function assignParticipant(groupId: number, participantId: number) {
  return request.post<void>(`/activities/${groupId}/participant/${participantId}`)
}

export function unassignParticipant(activityId: number, participantId: number, leaveReasonComment: string) {
  return request.delete<void>(`/activities/participant`, {
    data: {
      activityId,
      participantId,
      leaveReasonComment,
    },
  })
}
