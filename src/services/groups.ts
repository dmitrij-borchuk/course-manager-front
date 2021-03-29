import { getGroupRequest, getGroupsRequest } from '../api/groups'

export function getGroups(props?: { teacherId?: string }) {
  const teacher = props?.teacherId ? `teacher=${props.teacherId}` : ''
  return getGroupsRequest(`${teacher}`)
}

export function getGroup(id: string) {
  return getGroupRequest(id)
}
