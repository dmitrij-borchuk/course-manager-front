import { deleteStudentRequest, getStudentRequest, updateStudentRequest } from '../api/students'
import { Student } from '../types/student'

export function getStudent(id: string) {
  return getStudentRequest(id)
}

export function deleteStudent(id: string) {
  return deleteStudentRequest(id)
}

export function updateStudent(data: Student) {
  return updateStudentRequest(data)
}
