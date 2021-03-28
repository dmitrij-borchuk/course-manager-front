import { loginRequest } from '../api/auth'

export function setAuthData(jwt: string) {
  localStorage.setItem('learnify.auth.jwt', jwt)
}
export function getAuthData(): string {
  return localStorage.getItem('learnify.auth.jwt') || ''
}

export function login(data: Parameters<typeof loginRequest>[0]) {
  return loginRequest(data)
}
