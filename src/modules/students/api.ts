import { StudentBase } from 'types/student'
import request from '../../api/request'

export function checkStudentExistence(name: string) {
  return request.get<StudentBase | null>(`/students/search/${name}`)
}
