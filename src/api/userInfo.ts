import { NewUserInfo, UserInfo, UserInfoFull } from '../types/userInfo'
import request from './request'

export function createUserInfoRequest(data: NewUserInfo) {
  return request.post<{ id: string }>('/user-infos', data)
}

export function updateUserInfoRequest(data: UserInfo) {
  return request.put<UserInfoFull>(`/user-infos/${data.id}`, data)
}
