/// <reference types="cypress" />
import firebase from 'firebase/compat/app'

// Create organization
function createOrganization(data: any) {
  const tokenPromise = firebase.auth().currentUser.getIdToken()
  return cy.wrap(tokenPromise).then((token) => {
    return cy.request({
      url: `${Cypress.env('SERVER_URL')}/organizations`,
      method: 'POST',
      headers: {
        authorization: token,
      },
      body: data,
    })
  })
}
Cypress.Commands.add('createOrganization', createOrganization)

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable {
      /**
       * Custom command to login to the the application.
       * @example cy.createOrganization('key', {})
       */
      createOrganization: typeof createOrganization
    }
  }
}

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

  cy.callFirestore('delete', `organizations/${key}/groups`)
  cy.callFirestore('delete', `organizations/${key}/users`)
  cy.callFirestore('delete', `organizations/${key}`)
}
Cypress.Commands.add('deleteOrganization', deleteOrganization)

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      /**
       * Custom command to login to the the application.
       * @example cy.deleteOrganization('2cXFbfvwkUZNYBdcj7TyOXyel5k1', 'organization-key')
       */
      deleteOrganization: typeof deleteOrganization
    }
  }
}
