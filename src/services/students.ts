import { deleteStudentRequest, updateStudentRequest } from '../api/students'
import { Student } from '../types/student'

export function deleteStudent(id: string) {
  return deleteStudentRequest(id)
}

export function updateStudent(data: Student) {
  return updateStudentRequest(data)
}
