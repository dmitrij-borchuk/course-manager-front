export function addGroupDirectly(orgKey: string, id: string, data: any) {
  cy.callFirestore('set', `organizations/${orgKey}/groups/${id}`, data)
}
export function removeGroupDirectly(orgKey: string, id: string) {
  cy.callFirestore('delete', `organizations/${orgKey}/groups/${id}`)
}

export function addStudentToGroupDirectly(
  orgKey: string,
  data: {
    endDate: number | null
    groupId: string
    id: string
    startDate: number
    studentId: string
  }
) {
  cy.callFirestore('set', `organizations/${orgKey}/studentsToGroups/${data.id}`, data)
}
