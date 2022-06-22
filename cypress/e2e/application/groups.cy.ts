import { nanoid } from 'nanoid'

describe('Groups', () => {
  const orgId = nanoid()
  const orgKey = `test-organization-key-${orgId}`
  const orgName = `test-organization-name-${orgId}`
  let orgDBId = ''

  before(() => {
    cy.login()
    cy.createOrganization({
      key: orgKey,
      name: orgName,
    })
      .its('body')
      .then((body) => {
        orgDBId = body.rows[0].id
      })
    cy.log(`Created organization with key ${orgKey}`)
  })
  after(() => {
    cy.log(`Removing organization with key ${orgKey} and ID ${orgDBId}`)
    cy.deleteOrganization(orgKey, orgDBId)
  })
  it('Should be able to visit group page', () => {
    cy.visit(`/${orgKey}`)
    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {
        name: 'Groups',
      })
        .should('exist')
        .click()
    })
    cy.findByRole('heading', {
      name: 'Groups',
    }).should('exist')
  })
  it('Should be able to create group', () => {
    const id = nanoid()
    const name = `Group-${id}`
    cy.visit(`/${orgKey}/groups`)
    // cy.testId('addIcon').click()
    cy.findByRole('button', {
      name: 'Floating menu',
    }).click()

    // cy.get('.preloader-wrapper').should('not.exist')
    cy.get('#name').type(name)
    cy.findByRole('button', {
      name: /Submit/i,
    }).click()
    cy.getToastContent().should('contain.text', `Group has been successfully created`)
    cy.findByText(name).should('exist')
  })
  it('Should be able to visit group page', () => {
    const id = nanoid()
    const name = `Group-${id}`
    cy.addGroupDirectly(orgKey, id, {
      name: name,
      teacher: Cypress.env('TEST_UID'),
    })
    cy.visit(`/${orgKey}/groups/${id}`)
    cy.getSpinner().should('not.exist')
    cy.findByRole('heading', {
      name,
    }).should('exist')
  })
  it('Should be able to delete group', () => {
    const id = nanoid()
    const name = `Group-${id}`
    cy.addGroupDirectly(orgKey, id, {
      name: name,
      teacher: Cypress.env('TEST_UID'),
    })
    cy.visit(`/${orgKey}/groups/${id}`)
    cy.getSpinner().should('not.exist')
    cy.findByRole('button', {
      name: /delete/i,
    }).click()
    cy.findByRole('button', {
      name: /yes/i,
    }).click()
    cy.findByRole('heading', {
      name: /groups/i,
    }).should('exist')
    cy.findByText(name).should('not.exist')
  })
  it.only('Should be able to assign teacher', () => {
    addGroupAndVisitIt(orgKey)
    cy.findByText('No teacher assigned').should('exist')
    cy.findByRole('button', {
      name: /assign teacher/i,
    }).click()
  })

  it.skip('Should be able to edit group name', () => {})
  it.skip('Should be able to remove teacher', () => {})
  it.skip('Should be able to remove students', () => {})
})

function addGroupAndVisitIt(orgKey: string) {
  const id = nanoid()
  const name = `Group-${id}`
  cy.addGroupDirectly(orgKey, id, {
    name: name,
    teacher: Cypress.env('TEST_UID'),
  })
  cy.visit(`/${orgKey}/groups/${id}`)
  cy.getSpinner().should('not.exist')
}
