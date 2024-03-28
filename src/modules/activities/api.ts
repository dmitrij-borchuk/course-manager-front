import { Profile } from 'types/profile'
import { Activity, NewActivity } from '../../types/activity'
import request from '../../api/request'
import { User } from 'types/user'

export function migrateActivities() {
  return request.post<string>('/activities/migrate')
}

type FetchActivitiesParams = {
  performerId?: number
  archived?: 'true' | 'false' | 'all'
  deleted?: 'true' | 'false' | 'all'
  participantId?: number
  date?: Date
  excludeOldParticipants?: boolean
}
export function fetchActivities(params?: FetchActivitiesParams) {
  return request.get<ActivityWithParticipationAndPerformer[]>(`/activities`, {
    params: {
      ...params,
      include: 'performer',
    },
  })
}
export type ActivityWithParticipationAndPerformer = Activity & { studentsToActivities: ParticipationRaw[] } & {
  performer: User & {
    organizationsConnections: Profile[]
  }
}
type ParticipationRaw = {
  id: number
  activityId: number | null
  participantId: number | null
  startDate: string
  endDate: string | null
  createdAt: string
  updatedAt: string
  updatedBy: number
  leaveReasonComment: string | null
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
  return request.get<ActivityExtended>(`/activities/${id}`)
}
export type ActivityExtended = Activity & {
  performer: Profile
  archivedAt?: string
  archivedBy?: { id: number; name: string }
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
