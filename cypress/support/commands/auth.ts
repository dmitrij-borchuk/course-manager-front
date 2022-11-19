import firebase from 'firebase/compat/app'

export function getToken() {
  const tokenPromise = firebase.auth().currentUser.getIdToken()
  return cy.wrap(tokenPromise)
}

export function getUser() {
  const user = firebase.auth().currentUser
  return cy.wrap(user)
}
