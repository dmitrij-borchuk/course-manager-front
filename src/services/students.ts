import { deleteStudentRequest } from '../api/students'

export function deleteStudent(id: string) {
  return deleteStudentRequest(id)
}
