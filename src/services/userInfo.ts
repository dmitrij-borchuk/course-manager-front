import { createUserInfoRequest, getUserInfoRequest } from '../api/userInfo'
import { NewUserInfo } from '../types/userInfo'

export async function createUserInfo(data: NewUserInfo) {
  return await createUserInfoRequest(data)
}

export async function getUserInfo(id: string) {
  return getUserInfoRequest(id)
}
