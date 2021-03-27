import { Group } from '../types/group'
import request from './request'

export function getGroupsRequest() {
  return request.get<Group[]>(`/groups`)
}

export function getGroupRequest(id: string) {
  return request.get<Group>(`/groups/${id}`)
}
