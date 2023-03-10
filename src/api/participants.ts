import { Student } from '../types/student'
import request from './request'

export function fetchParticipantsByActivity(id: number, startDate: Date) {
  return request.get<Student[]>(`/students/byActivity/${id}?startDate=${startDate.toISOString()}`, {})
}

export function fetchParticipant(id: number) {
  return request.get<Student>(`/students/${id}`)
}
