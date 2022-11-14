export function addStudentDirectly(orgId: number, data: any) {
  return cy.getToken().then((token) =>
    cy.request({
      url: `${Cypress.env('SERVER_URL')}/students?orgId=${orgId}`,
      method: 'post',
      headers: {
        authorization: token,
      },
      body: data,
    })
  )
}
export function removeStudentDirectly(orgId: string, id: number) {
  cy.getToken().then((token) => {
    cy.request({
      url: `${Cypress.env('SERVER_URL')}/students/${id}?orgId=${orgId}`,
      method: 'delete',
      headers: {
        authorization: token,
      },
    })
  })
}
