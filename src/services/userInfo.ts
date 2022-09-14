import { getUserInfoRequest } from '../api/userInfo'

export async function getUserInfo(id: string) {
  return getUserInfoRequest(id)
}
