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
