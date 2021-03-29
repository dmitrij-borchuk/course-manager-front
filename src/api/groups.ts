import { GroupFull } from '../types/group'
import request from './request'

export function getGroupsRequest(params?: string) {
  return request.get<GroupFull[]>(`/groups?${params || ''}`)
}

export function getGroupRequest(id: string) {
  return request.get<GroupFull>(`/groups/${id}`)
}
