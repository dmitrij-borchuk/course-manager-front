import request from './request'

export function deleteGroupRequest(id: string) {
  return request.delete<void>(`/groups/${id}`)
}
