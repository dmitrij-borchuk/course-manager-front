import { getStudentRequest, getStudentsRequest } from '../api/students'

export function getStudents(props?: { teacherId?: string }) {
  const teacher = props?.teacherId ? `teacher=${props.teacherId}` : ''
  return getStudentsRequest(`${teacher}`)
}

export function getStudent(id: string) {
  return getStudentRequest(id)
}
