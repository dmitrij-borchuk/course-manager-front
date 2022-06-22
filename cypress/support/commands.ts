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
import { addGroupDirectly } from './commands/groups'

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
      /**
       * @example cy.addGroupDirectly('org1', {})
       */
      addGroupDirectly: typeof addGroupDirectly
    }
  }
}
Cypress.Commands.add('addGroupDirectly', addGroupDirectly)
Cypress.Commands.add('getOrgKey', getOrgKey)
Cypress.Commands.add('getOrgName', getOrgName)
Cypress.Commands.add('getSpinner', getSpinner)
