import {
  createGroupRequest,
  deleteGroupRequest,
  getGroupRequest,
  getGroupsRequest,
  updateGroupRequest,
} from '../api/groups'

export function getGroups(props?: { teacherId?: string }) {
  const teacher = props?.teacherId ? `teacher=${props.teacherId}` : ''
  return getGroupsRequest(`${teacher}`)
}

export function getGroup(id: string) {
  return getGroupRequest(id)
}

export async function editGroup(data: Parameters<typeof updateGroupRequest>[0]) {
  return await updateGroupRequest(data)
}

export async function createGroup(data: Parameters<typeof createGroupRequest>[0]) {
  return await createGroupRequest(data)
}

export async function deleteGroup(id: string) {
  return deleteGroupRequest(id)
}
