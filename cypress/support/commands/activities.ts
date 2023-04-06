import { NewActivity, Activity } from '../../../src/types/activity'

export function addActivityDirectly(orgKey: string, data: NewActivity & { archived?: boolean }) {
  return cy.getToken().then((token) =>
    cy.request<Activity>({
      url: `${Cypress.env('SERVER_URL')}/activities`,
      method: 'post',
      headers: {
        authorization: token,
        'x-organization': orgKey,
      },
      body: data,
    })
  )
}
export function removeActivityDirectly(orgKey: string, id: number) {
  cy.getToken().then((token) => {
    cy.request({
      url: `${Cypress.env('SERVER_URL')}/activities/${id}`,
      method: 'delete',
      headers: {
        authorization: token,
        'x-organization': orgKey,
      },
    })
  })
}

export function addStudentToGroupDirectly(orgKey: string, groupId: number, participantId: number) {
  return cy.getToken().then((token) => {
    return cy.request({
      url: `${Cypress.env('SERVER_URL')}/activities/${groupId}/participant/${participantId}`,
      method: 'post',
      headers: {
        authorization: token,
        'x-organization': orgKey,
      },
    })
  })
}
