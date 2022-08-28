import { UserInfoFull } from '../types/userInfo'
import request from './request'

// TODO: remove it

export function getUserInfoRequest(id: string) {
  return request.get<UserInfoFull>(`/user-infos/${id}`)
}
