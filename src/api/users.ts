import { InviteResponse } from '../types/invite'
import { NewUser, OrganizationUser, User } from '../types/user'
import request from './request'

export function createUserRequest(data: NewUser) {
  return request.post<User>('/users', data)
}

export function getUsersRequest(orgId: string) {
  return request.get<OrganizationUser[]>(`/users/${orgId}`)
}

export function getUserRequest(orgId: string, id: string) {
  return request.get<OrganizationUser>(`/users/${orgId}/${id}`)
}
export function getUserByOuterIdRequest(orgId: string, id: string) {
  return request.get<OrganizationUser>(`/users/byOuterId/${orgId}/${id}`)
}

export function deleteUserRequest(id: string) {
  return request.delete<void>(`/users/${id}`)
}

export function getProfile() {
  return request.get<User>('/auth/me')
}

export function migrateUsers() {
  return request.post<string>('/auth/migrate')
}

type UserInviteData = {
  email: string
  role: string
  orgId: string
}
export function inviteUser(data: UserInviteData) {
  return request.post<InviteResponse>('/users/invite', data)
}
export function confirmInvitation(token: string) {
  return request.post('/users/confirmInvitation', { token })
}
