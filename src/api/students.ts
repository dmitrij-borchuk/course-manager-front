import { NewStudent, Student, StudentFull } from '../types/student'
import request from './request'

export function getStudentsRequest(params?: string) {
  return request.get<StudentFull[]>(`/students?${params || ''}`)
}

export function getStudentRequest(id: string) {
  return request.get<StudentFull>(`/students/${id}`)
}

export function deleteStudentRequest(id: string) {
  return request.delete<void>(`/students/${id}`)
}

export function updateStudentRequest(data: Student) {
  return request.put<StudentFull>(`/students/${data.id}`, data)
}

export function createStudentRequest(data: NewStudent) {
  return request.post<StudentFull>(`/students`, data)
}
