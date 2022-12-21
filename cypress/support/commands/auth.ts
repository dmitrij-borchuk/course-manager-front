import firebase from 'firebase/compat/app'
import { User } from '../../../src/types/user'

export function getToken() {
  const tokenPromise = firebase.auth().currentUser.getIdToken()
  return cy.wrap(tokenPromise)
}

export function getFirebaseUser() {
  const user = firebase.auth().currentUser
  return cy.wrap(user)
}

export function getUser() {
  return cy.getToken().then((token) =>
    cy.request<User>({
      url: `${Cypress.env('SERVER_URL')}/users/me`,
      method: 'get',
      headers: {
        authorization: token,
      },
    })
  )
}
