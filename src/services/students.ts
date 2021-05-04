import { deleteStudentRequest, getStudentRequest, getStudentsRequest, updateStudentRequest } from '../api/students'
import { Student } from '../types/student'

export function getStudents(props?: { teacherId?: string }) {
  const teacher = props?.teacherId ? `teacher=${props.teacherId}` : ''
  return getStudentsRequest(`${teacher}`)
}

export function getStudent(id: string) {
  return getStudentRequest(id)
}

export function deleteStudent(id: string) {
  return deleteStudentRequest(id)
}

export function updateStudent(data: Student) {
  return updateStudentRequest(data)
}
