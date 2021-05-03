import { NewUserInfo, UserInfo, UserInfoFull } from '../types/userInfo'
import request from './request'

export function getUsersInfoRequest(params?: string) {
  return request.get<UserInfoFull[]>(`/user-infos?${params || ''}`)
}

export function getUserInfoRequest(id: string) {
  return request.get<UserInfoFull>(`/user-infos/${id}`)
}

export function createUserInfoRequest(data: NewUserInfo) {
  return request.post<UserInfoFull>('/user-infos', data)
}

export function updateUserInfoRequest(data: UserInfo) {
  return request.put<UserInfoFull>(`/user-infos/${data.id}`, data)
}
