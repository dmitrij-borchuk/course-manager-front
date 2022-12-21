import { NewStudent, Student } from '../../../src/types/student'

export function addStudentDirectly(orgKey: string, data: NewStudent) {
  return cy.getToken().then((token) =>
    cy.request<Student>({
      url: `${Cypress.env('SERVER_URL')}/students`,
      method: 'post',
      headers: {
        authorization: token,
        'x-organization': orgKey,
      },
      body: data,
    })
  )
}
export function removeStudentDirectly(orgKey: string, id: number) {
  cy.getToken().then((token) => {
    cy.request<void>({
      url: `${Cypress.env('SERVER_URL')}/students/${id}`,
      method: 'delete',
      headers: {
        authorization: token,
        'x-organization': orgKey,
      },
    })
  })
}
