import { Student } from '../types/student'
import request from './request'

export function migrateStudents() {
  return request.post<string>('/students/migrate')
}

export function fetchStudentsByOrg(id: number) {
  return request.get<Student[]>(`/students/byOrganization/${id}`)
}

export function fetchStudent(orgId: number, id: number) {
  return request.get<Student>(`/students/${id}?orgId=${orgId}`)
}

export function deleteStudent(orgId: number, id: number) {
  return request.delete<Student>(`/students/${id}?orgId=${orgId}`)
}

type NewStudent = Omit<Student, 'id'>
export function createStudent(orgId: number, data: NewStudent) {
  return request.post<Student>(`/students?orgId=${orgId}`, data)
}

export function editStudent(orgId: number, id: number, data: Student) {
  return request.put<Student>(`/students/${id}?orgId=${orgId}`, data)
}
