import { GroupFull, NewGroup } from '../types/group'
import request from './request'

export function getGroupsRequest(params?: string) {
  return request.get<GroupFull[]>(`/groups?${params || ''}`)
}

export function getGroupRequest(id: string) {
  return request.get<GroupFull>(`/groups/${id}`)
}

export function updateGroupRequest(data: GroupFull) {
  return request.put<GroupFull>(`/groups/${data.id}`, data)
}

export function createGroupRequest(data: NewGroup) {
  return request.post<GroupFull>(`/groups`, data)
}

export function deleteGroupRequest(id: string) {
  return request.delete<void>(`/groups/${id}`)
}
