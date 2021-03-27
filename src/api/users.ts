import { NewUser, User } from '../types/user'
import request from './request'

export function createUserRequest(data: NewUser) {
  return request.post<{ id: string }>('/users', data)
}

export function getUsersRequest(params?: string) {
  return request.get<User[]>(`/users?${params || ''}`)
}

export function getUserRequest(id: string) {
  return request.get<User>(`/users/${id}`)
}
