import firebase from 'firebase/compat/app'

export function getOrgKey(id: string) {
  return `test-organization-key-${id}`
}

export function getOrgName(id: string) {
  return `test-organization-name-${id}`
}
export function getSpinner() {
  return cy.testId('loader-spinner')
}

function getFirebaseToken() {
  const tokenPromise = firebase.auth().currentUser.getIdToken()
  return cy.wrap<Promise<string>, string>(tokenPromise)
}
Cypress.Commands.add('getFirebaseToken', getFirebaseToken)
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      getFirebaseToken: typeof getFirebaseToken
    }
  }
}
