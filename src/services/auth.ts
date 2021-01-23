export function setAuthData(jwt: string) {
  localStorage.setItem('lernify.auth.jwt', jwt)
}
export function getAuthData(): string {
  return localStorage.getItem('lernify.auth.jwt') || ''
}
