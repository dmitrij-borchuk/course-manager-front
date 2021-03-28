import { User } from '../types/user'
import request from './request'

interface LoginRequestData {}
export function loginRequest(data: LoginRequestData) {
  return request.post<{ jwt: string; user: User }>('/auth/local', data)
}
