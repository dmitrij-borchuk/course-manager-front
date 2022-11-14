import { nanoid } from 'nanoid'
import studentPage from '../../drivers/studentPage'
import { getOrgKey, getOrgName } from '../../support/commands/utils'

const studentOuterId = `test-student-${nanoid()}`

describe('Attendance', () => {
  const orgId = nanoid()
  const orgKey = getOrgKey(orgId)
  let orgDbId
  let createOrgRequest: Cypress.Chainable<Cypress.Response<any>>

  before(() => {
    cy.login()
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

  beforeEach(() => {
    const groupId = `test-group-${nanoid()}`
    cy.wrap(groupId).as('groupId')
    cy.addGroupDirectly(orgKey, groupId, {
      name: 'Test group',
      teacher: Cypress.env('TEST_UID'),
    })
    cy.addStudentDirectly(orgDbId, {
      tags: [],
      name: 'Test Student Name',
      outerId: studentOuterId,
    }).as('addStudentResponse')
    cy.addStudentToGroupDirectly(orgKey, {
      endDate: null,
      groupId,
      id: nanoid(),
      startDate: Date.now() - 1000 * 60 * 60,
      studentId: studentOuterId,
    })
  })
  afterEach(() => {
    cy.get<string>('@groupId').then((groupId) => {
      cy.removeGroupDirectly(orgKey, groupId)
    })
    cy.get('@addStudentResponse')
      .its('body')
      .then((body) => {
        cy.removeStudentDirectly(orgDbId, body.id)
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
    // Check if attendance is not there
    cy.visit(`/${orgKey}/`)
    waitLoading()

    cy.visit(`/${orgKey}/attendance/add`)
    waitLoading()
    chooseGroup('Test group')
    chooseStudent('Test Student Name')
    submit()
    waitLoading()

    // Check if attendance is created
    cy.findByText('Report has been successfully submitted').should('exist')
    cy.findByText('Test group').should('exist')
  })

  it('Attendance should be visible on the student page', () => {
    cy.visit(`/${orgKey}/attendance/add`)
    waitLoading()
    chooseGroup('Test group')
    chooseStudent('Test Student Name')
    submit()
    waitLoading()

    cy.get('@addStudentResponse')
      .its('body')
      .then((body) => {
        cy.visit(`/${orgKey}/students/${body.id}`)
      })

    studentPage.waitLoading()
    studentPage.getAttendance().should('have.text', '100%')
  })
})

function waitLoading() {
  cy.testId('loader-spinner').should('not.exist')
  cy.findByText('Loading').should('not.exist')
}

function chooseGroup(name: string) {
  cy.findByLabelText('Group').parent().click()
  cy.get('[id*=select-options]').findByText(name).click()
}

function chooseStudent(name: string) {
  cy.findByText(name).click()
}

function submit() {
  cy.findByRole('button', { name: /Submit/i }).click()
}
