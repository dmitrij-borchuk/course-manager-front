import { createStudentRequest, deleteStudentRequest, getStudentRequest, updateStudentRequest } from '../api/students'
import { NewStudent, Student } from '../types/student'

export function getStudent(id: string) {
  return getStudentRequest(id)
}

export function deleteStudent(id: string) {
  return deleteStudentRequest(id)
}

export function updateStudent(data: Student) {
  return updateStudentRequest(data)
}

export function createStudent(data: NewStudent) {
  return createStudentRequest(data)
}
