export type NewStudentOfGroup = {
  groupId: string
  studentId: string
  // Time in milliseconds (UTC)
  startDate: number
  // Time in milliseconds (UTC)
  endDate: number | null
}

export type StudentOfGroup = NewStudentOfGroup & {
  id: string
}
