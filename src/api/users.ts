import { InviteResponse } from '../types/invite'
import { NewUser, OrganizationUser, User } from '../types/user'
import request from './request'

export function createUserRequest(data: NewUser) {
  return request.post<User>('/users', data)
}

// TODO: Probably need to be removed
export function getUsersRequest(orgId: number) {
  return request.get<OrganizationUser[]>(`/users/${orgId}`)
}

export function getUserRequest(orgId: number, id: number) {
  return request.get<OrganizationUser>(`/users/${orgId}/${id}`)
}
export function getUserByOuterIdRequest(orgId: number, id: string) {
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
  orgId: number
}
export function inviteUser(data: UserInviteData) {
  return request.post<InviteResponse>('/users/invite', data)
}
export function confirmInvitation(token: string, name: string) {
  return request.post('/users/confirmInvitation', { token, name })
}

export function updateUser(id: number, name: string) {
  return request.put<User>(`/users/${id}`, { name })
}

export function registerUser(credentials: { email: string; name: string; password: string }) {
  return request.post<User>(`/auth/register`, credentials)
}
