import { NewUser, User } from '../types/user'
import request from './request'

export function createUserRequest(data: NewUser) {
  return request.post<User>('/users', data)
}

export function getUsersRequest(params?: string) {
  return request.get<User[]>(`/users?${params || ''}`)
}

export function getUserRequest(id: string) {
  return request.get<User>(`/users/${id}`)
}

export function deleteUserRequest(id: string) {
  return request.delete<void>(`/users/${id}`)
}
