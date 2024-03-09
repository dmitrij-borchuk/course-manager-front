import request from 'api/request'

export function runBackup() {
  return request.post<string>(`/dump`)
}
