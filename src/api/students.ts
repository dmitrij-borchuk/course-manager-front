import { Student } from '../types/student'
import request from './request'

export function migrateStudents() {
  return request.post<string>('/students/migrate')
}

export function fetchStudents() {
  return request.get<Student[]>(`/students`)
}

export function deleteStudent(id: number) {
  return request.delete<Student>(`/students/${id}`)
}

type NewStudent = Omit<Student, 'id'>
export function createStudent(data: NewStudent) {
  return request.post<Student>(`/students`, data)
}

export function editStudent(orgId: number, id: number, data: Student) {
  return request.put<Student>(`/students/${id}?orgId=${orgId}`, data)
}
