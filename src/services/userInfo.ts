import { createUserInfoRequest } from '../api/userInfo'
import { NewUserInfo } from '../types/userInfo'

export async function createUserInfo(data: NewUserInfo) {
  return await createUserInfoRequest(data)
}
