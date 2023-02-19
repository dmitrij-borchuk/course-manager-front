import firebase from 'firebase/compat/app'
// import { initializeApp, cert } from 'firebase-admin/app'
// import { getAuth } from 'firebase-admin/auth'
// import * as admin from 'firebase-admin'
import { User } from '../../../src/types/user'
// import {  } from 'firebase-admin/auth'
// import { auth } from 'firebase-admin/lib/auth'

// const { initializeApp } = require('firebase-admin/app');
// const app = admin.app()
// const app = admin.
// initializeApp({
//   credential: cert({
//     projectId: Cypress.env('FIREBASE_PROJECT_ID'),
//     clientEmail: Cypress.env('FIREBASE_CLIENT_EMAIL'),
//     privateKey: Cypress.env('FIREBASE_PRIVATE_KEY'),
//   }),
// })
// initializeApp({
//   credential: applicationDefault(),
//   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
// });

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

export async function deleteUser(email: string) {
  //   const auth = getAuth()
  //   try {
  //     const user = await auth.getUserByEmail(email)
  //     auth.deleteUser(user.uid)
  //   } catch (error) {
  //     console.log(`User with email "${email}" not found, skipping deletion.`)
  //   }
}
