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

declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Custom command to login to the the application.
     * @example cy.login('email', 'password')
     */
    login: typeof login

    /**
     * Custom command to adjust student list to correct number.
     * @example cy.makeStudentList(10)
     */
    makeStudentList: typeof makeStudentList

    /**
     * Custom command to create organization if not exists.
     * @example cy.makeOrganizationIfNotExists()
     */
    makeOrganizationIfNotExists: typeof makeOrganizationIfNotExists
  }
}

function login(email, password) {
  cy.visit('/login')
  cy.get('.preloader-wrapper').should('not.exist')
  cy.get('#identifier').type(email)
  cy.get('#password').type(password)
  cy.testId('submit').click()
  cy.url().should('not.contain', '/login')
}
Cypress.Commands.add('login', login)

function removeAllStudents(orgId: string) {
  cy.visit(`${orgId}/students`)
  cy.testId('app-preloader').should('not.exist')
  cy.testId('empty-list-text').then((emptyListMessage) => {
    console.log('=-= emptyListMessage', emptyListMessage)
    if (emptyListMessage) {
      return
    }

    cy.testId('list-link-item').first().click()
    cy.testId('delete-btn').click()
    cy.testId('dialog-btn-yes').click()
  })
}
function makeStudentList(orgId: string, number: number) {
  removeAllStudents(orgId)
  cy.visit(`${orgId}/students`)
  cy.testId('app-preloader').should('not.exist')
  // Cypress._.times(1, (i) => {
  // it(`num ${i + 1} - test the thing conditionally`, () => {
  //   // do the conditional bits 100 times
  // })
  cy.testId('main-button').click()
  // cy.location('pathname', { timeout: 10000 }).should('include', '/add')
  cy.testId('app-preloader').should('not.exist')
  cy.testId('loader-spinner').should('not.exist')
  // cy.testId('loader-spinner').should('not.exist')
  cy.get('#name').type(`Student ${1} - ${Math.random()}`)
  cy.testId('submit').click()
  // })
  // cy.get('#identifier').type(email)
  // cy.get('#password').type(password)
  // cy.testId('submit').click()
}
Cypress.Commands.add('makeStudentList', makeStudentList)

function makeOrganizationIfNotExists() {
  cy.visit('/organizations/add')
  cy.testId('app-preloader').should('not.exist')
  cy.get('#id').type('organization')
  cy.get('#name').type('organization 1')
  cy.testId('submit').click()
  // cy.get('#identifier').type(email)
  // cy.get('#password').type(password)
  // cy.testId('submit').click()
}
Cypress.Commands.add('makeOrganizationIfNotExists', makeOrganizationIfNotExists)
