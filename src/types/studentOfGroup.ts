export type NewStudentOfGroup = {
  groupId: string
  studentId: string
  startDate: string
  endDate: string | null
}

export type StudentOfGroup = NewStudentOfGroup & {
  id: string
}
