import request from 'api/request'

export function generateApiKey() {
  return request.post<string>(`/api/b2b/generateApiToken`)
}
