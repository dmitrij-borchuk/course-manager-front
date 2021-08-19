import { NewUserInfo, UserInfoFull } from '../types/userInfo'
import request from './request'

export function getUserInfoRequest(id: string) {
  return request.get<UserInfoFull>(`/user-infos/${id}`)
}

export function createUserInfoRequest(data: NewUserInfo) {
  return request.post<UserInfoFull>('/user-infos', data)
}
