import { nanoid } from 'nanoid'
import { getOrgKey, getOrgName } from '../../support/commands/utils'
describe('Attendance', () => {
  const orgId = nanoid()
  const orgKey = getOrgKey(orgId)
  let orgDbId
  let createOrgRequest: Cypress.Chainable<Cypress.Response<any>>

  before(() => {
    cy.loginAndSaveToken()
    createOrgRequest = cy
      .createOrganization({
        key: orgKey,
        name: getOrgName(orgId),
      })
      .its('body')
      .then((body) => {
        orgDbId = body.rows[0].id
      })
  })
  after(() => {
    createOrgRequest.its('body').then((body) => {
      cy.deleteOrganization(cy.getOrgKey(orgId), body.rows[0].id)
    })
  })
  it.skip('Should be on the teachers list', () => {
    cy.visit('/')
    cy.testId('main-button').click()

    cy.visit('/t1/students')
    cy.get('.preloader-wrapper').should('not.exist')
    cy.get('#identifier').type('wrong login')
    cy.get('#password').type('wrong password')
    cy.testId('submit').click()
    cy.getToastContent().should('not.be.empty')
  })

  it('User should be able to visit attendance creation page', () => {
    cy.visit(`/${orgKey}`)
    cy.testId('main-button').click()
    cy.findByLabelText('Report class').click()
    cy.findByText('Add Attendance').should('be.visible')
  })

  it('User should be able to create attendance', () => {
    const groupId = `test-group-${nanoid()}`
    cy.addGroupDirectly(orgKey, groupId, {
      name: 'Test group',
      teacher: Cypress.env('TEST_UID'),
    })
    const studentId = `test-student-${nanoid()}`
    cy.addStudentDirectly(orgDbId, {
      tags: [],
      name: 'Test Student Name',
      outerId: studentId,
    }).as('addStudentResponse')
    cy.addStudentToGroupDirectly(orgKey, {
      endDate: null,
      groupId,
      id: nanoid(),
      startDate: Date.now() - 1000 * 60 * 60,
      studentId: studentId,
    })

    // Check if attendance is not there
    cy.visit(`/${orgKey}/`)
    cy.testId('loader-spinner').should('not.exist')
    cy.findByText('Test group').should('not.exist')

    cy.visit(`/${orgKey}/attendance/add`)
    cy.testId('loader-spinner').should('not.exist')
    cy.findByText('Loading').should('not.exist')
    cy.findByLabelText('Group').parent().click()
    cy.get('[id*=select-options]').findByText('Test group').click()

    cy.findByText('Test Student Name').click()
    cy.findByRole('button', { name: /Submit/i }).click()

    // Check if attendance is created
    cy.findByText('Report has been successfully submitted').should('exist')
    cy.findByText('Test group').should('exist')

    cy.removeGroupDirectly(orgKey, groupId)
    cy.get('@addStudentResponse')
      .its('body')
      .then((body) => {
        cy.removeStudentDirectly(orgDbId, body.id)
      })
  })
})
