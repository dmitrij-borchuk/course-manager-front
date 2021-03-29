import { StudentFull } from '../types/student'
import request from './request'

export function getStudentsRequest(params?: string) {
  return request.get<StudentFull[]>(`/students?${params || ''}`)
}

export function getStudentRequest(id: string) {
  return request.get<StudentFull>(`/students/${id}`)
}
