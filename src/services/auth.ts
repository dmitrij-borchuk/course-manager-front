export function setAuthData(jwt: string) {
  localStorage.setItem('learnify.auth.jwt', jwt)
}
export function getAuthData(): string {
  return localStorage.getItem('learnify.auth.jwt') || ''
}
