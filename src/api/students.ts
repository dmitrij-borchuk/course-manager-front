import { Student } from '../types/student'
import request from './request'

export function migrateStudents() {
  return request.post<string>('/students/migrate')
}

export function fetchStudentsByOrg(id: number) {
  return request.get<Student[]>(`/students/byOrganization/${id}`)
}
