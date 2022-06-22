export function addGroupDirectly(orgKey: string, id: string, data: any) {
  cy.callFirestore('set', `organizations/${orgKey}/groups/${id}`, data)
}
