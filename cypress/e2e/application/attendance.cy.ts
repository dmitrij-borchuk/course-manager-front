import { nanoid } from 'nanoid'

describe('Attendance', () => {
  const orgId = nanoid()
  const orgKey = cy.getOrgKey(orgId)

  beforeEach(() => {
    cy.login()
  })
  before(() => {
    cy.login()
    cy.createOrganization({
      key: orgKey,
      name: cy.getOrgName(orgId),
    }).as('create')
  })
  after(() => {
    cy.get('@create')
      .its('body')
      .then((body) => {
        cy.deleteOrganization(cy.getOrgKey(orgId), body.rows[0].id)
      })
  })
  it.skip('Should be on the teachers list', () => {
    cy.visit('/')
    cy.testId('addIcon').click()

    cy.visit('/t1/students')
    cy.get('.preloader-wrapper').should('not.exist')
    cy.get('#identifier').type('wrong login')
    cy.get('#password').type('wrong password')
    cy.testId('submit').click()
    cy.getToastContent().should('not.be.empty')
  })

  it('User should be able to visit attendance creation page', () => {
    cy.visit(`/${orgKey}`)
    cy.testId('addIcon').click()
    cy.findByLabelText('Report class').click()
    cy.findByText('Add Attendance').should('be.visible')
  })

  it('User should be able to create attendance', () => {
    const groupId = `test-group-${nanoid()}`
    cy.addGroupDirectly(orgKey, groupId, {
      name: 'Test group',
      teacher: Cypress.env('TEST_UID'),
    })
    cy.visit(`/${orgKey}/attendance/add`)
    cy.testId('loader-spinner').should('not.exist')
    cy.testId('group-selector').select(groupId)
  })
})
