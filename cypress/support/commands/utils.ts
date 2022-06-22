export function getOrgKey(id: string) {
  return `test-organization-key-${id}`
}

export function getOrgName(id: string) {
  return `test-organization-name-${id}`
}
export function getSpinner() {
  return cy.testId('loader-spinner')
}
