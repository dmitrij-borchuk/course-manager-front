export type NewStudentOfGroup = {
  groupId: string
  studentId: string
}

export type StudentOfGroup = NewStudentOfGroup & {
  id: string
}
