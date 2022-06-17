// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
/// <reference types="cypress" />

// Import commands.js using ES2015 syntax:
import './commands'

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.testId('greeting')
       */
      testId: typeof getByTestId

      /**
       * Custom command to select content of the toast notification.
       * @example cy.getToastContent()
       */
      getToastContent: typeof getToastContent
    }
  }
}

function getByTestId(value: string) {
  return cy.get(`[data-testid=${value}]`)
}
Cypress.Commands.add('testId', getByTestId)

function getToastContent() {
  return cy.get('.react-toast-notifications__toast__content')
}
Cypress.Commands.add('getToastContent', getToastContent)
