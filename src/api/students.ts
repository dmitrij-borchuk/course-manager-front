import request from './request'

export function deleteStudentRequest(id: string) {
  return request.delete<void>(`/students/${id}`)
}
