/// <reference types="cypress" />
import firebase from 'firebase/compat/app'
import { Organization, OrganizationCreate } from '../../../src/types/organization'

// Create organization
function createOrganization(data: OrganizationCreate) {
  const tokenPromise = firebase.auth().currentUser.getIdToken()
  return cy
    .wrap(tokenPromise)
    .then((token) => {
      return cy.request<Organization>({
        url: `${Cypress.env('SERVER_URL')}/organizations`,
        method: 'POST',
        headers: {
          authorization: token,
        },
        body: data,
      })
    })
    .then(({ body }) => {
      const id = firebase.auth().currentUser.uid
      cy.callFirestore('set', `organizations/${body.key}/users/${id}`, {
        id,
      })

      return cy.wrap<Organization>(body)
    })
}
Cypress.Commands.add('createOrganization', createOrganization)

// Delete organization by key
function deleteOrganization(key: string, id: number) {
  const tokenPromise = firebase.auth().currentUser.getIdToken()
  cy.wrap(tokenPromise).then((token) => {
    cy.request({
      url: `${Cypress.env('SERVER_URL')}/organizations/${id}`,
      method: 'delete',
      headers: {
        authorization: token,
      },
    })
  })

  cy.callFirestore('delete', `organizations/${key}/studentsToGroups`)
  cy.callFirestore('delete', `organizations/${key}/groups`)
  cy.callFirestore('delete', `organizations/${key}/users`)
  cy.callFirestore('delete', `organizations/${key}`)
}
Cypress.Commands.add('deleteOrganization', deleteOrganization)

function getOrganizationByKey(key: string) {
  return cy.getFirebaseToken().then((token) => {
    return cy
      .request<Organization[]>({
        url: `${Cypress.env('SERVER_URL')}/organizations`,
        method: 'get',
        headers: {
          authorization: token,
        },
      })
      .then((resp) => {
        if (resp.body.length === 0) {
          throw new Error('No organizations found')
        }
        return resp.body.find((org) => org.key === key)
      })
  })
}
Cypress.Commands.add('getOrganizationByKey', getOrganizationByKey)

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      /**
       * Custom command to login to the the application.
       * @example cy.deleteOrganization('2cXFbfvwkUZNYBdcj7TyOXyel5k1', 'organization-key')
       */
      deleteOrganization: typeof deleteOrganization
      /**
       * Custom command to login to the the application.
       * @example cy.createOrganization('key', {})
       */
      createOrganization: typeof createOrganization

      getOrganizationByKey: typeof getOrganizationByKey
    }
  }
}
