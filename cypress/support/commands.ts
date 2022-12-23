// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/// <reference types="cypress" />
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/firestore'
import { attachCustomCommands } from 'cypress-firebase'
import '@testing-library/cypress/add-commands'
import './commands/organization'
import { getOrgKey, getOrgName, getSpinner } from './commands/utils'
import { getToken, getFirebaseUser, getUser } from './commands/auth'
import { addStudentDirectly, removeStudentDirectly } from './commands/students'
import { addActivityDirectly, addStudentToGroupDirectly, removeActivityDirectly } from './commands/activities'

const firebaseConfig = {
  apiKey: Cypress.env('FIREBASE_API_KEY'),
  authDomain: `${Cypress.env('FIREBASE_PROJECT_ID')}.firebaseapp.com`,
  databaseURL: `https://${Cypress.env('FIREBASE_PROJECT_ID')}.firebaseio.com`,
  projectId: `${Cypress.env('FIREBASE_PROJECT_ID')}`,
  storageBucket: `${Cypress.env('FIREBASE_PROJECT_ID')}.appspot.com`,
  messagingSenderId: Cypress.env('FIREBASE_MESSAGING_SENDER_ID'),
  appId: Cypress.env('FIREBASE_APP_ID'),
  measurementId: Cypress.env('FIREBASE_MEASUREMENT_ID'),
}

firebase.initializeApp(firebaseConfig)

attachCustomCommands({ Cypress, cy, firebase })

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      getSpinner: typeof getSpinner

      /**
       * @example cy.getOrgName('id')
       */
      getOrgName: typeof getOrgName
      /**
       * @example cy.getOrgKey('id')
       */
      getOrgKey: typeof getOrgKey
      addStudentToGroupDirectly: typeof addStudentToGroupDirectly

      getToken: typeof getToken
      getFirebaseUser: typeof getFirebaseUser
      getUser: typeof getUser

      addStudentDirectly: typeof addStudentDirectly
      removeStudentDirectly: typeof removeStudentDirectly

      addActivityDirectly: typeof addActivityDirectly
      removeActivityDirectly: typeof removeActivityDirectly
    }
  }
}
Cypress.Commands.add('addStudentToGroupDirectly', addStudentToGroupDirectly)

Cypress.Commands.add('addStudentDirectly', addStudentDirectly)
Cypress.Commands.add('removeStudentDirectly', removeStudentDirectly)

Cypress.Commands.add('addActivityDirectly', addActivityDirectly)
Cypress.Commands.add('removeActivityDirectly', removeActivityDirectly)

Cypress.Commands.add('getOrgKey', getOrgKey)
Cypress.Commands.add('getOrgName', getOrgName)
Cypress.Commands.add('getSpinner', getSpinner)
Cypress.Commands.add('getToken', getToken)
Cypress.Commands.add('getFirebaseUser', getFirebaseUser)
Cypress.Commands.add('getUser', getUser)

// Monkey patching Cypress.log to hide firestore requests (they are too long)
const origLog = Cypress.log
Cypress.log = function (opts, ...other) {
  //@ts-ignore
  if (opts.displayName === 'fetch' && opts.url.startsWith('https://firestore.googleapis.com')) {
    return origLog(
      {
        ...opts,
        //@ts-ignore
        renderProps() {
          return {
            message: `🔥base request (details hidden by customization "Cypress.log")`,
          }
        },
      },
      ...other
    )
  }
  return origLog(opts, ...other)
}
