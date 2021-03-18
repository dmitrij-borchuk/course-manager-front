import { NewUserInfo } from '../types/userInfo'
import request from './request'

export function createUserInfoRequest(data: NewUserInfo) {
  return request.post<{ id: string }>('/user-infos', data)
}
