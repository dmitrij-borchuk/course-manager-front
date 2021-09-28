import { Student, StudentFull } from '../types/student'
import request from './request'

export function deleteStudentRequest(id: string) {
  return request.delete<void>(`/students/${id}`)
}

export function updateStudentRequest(data: Student) {
  return request.put<StudentFull>(`/students/${data.id}`, data)
}
