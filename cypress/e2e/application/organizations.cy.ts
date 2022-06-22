import { nanoid } from 'nanoid'

describe('Organizations', () => {
  before(() => {
    cy.login()
  })
  it('Successfully created', () => {
    const id = nanoid()
    const name = `test-organization-name-${id}`
    cy.visit('/')
    cy.intercept('/organizations', { hostname: 'localhost', method: 'POST' }, (req, res) => {}).as('create')
    createOrganization(id)

    cy.getToastContent().should('not.be.empty')
    cy.findByText(name).should('exist')
    cy.wait('@create')
      .its('response.body')
      .then((body) => {
        cy.deleteOrganization(`test-organization-key-${id}`, body.rows[0].id)
      })
  })

  it('User should not be able to create organizations with the same key', () => {
    const id = nanoid()
    cy.createOrganization({
      key: cy.getOrgKey(id),
      name: cy.getOrgName(id),
    }).as('create')
    cy.get('@create')
      .its('body')
      .then((body) => {
        cy.visit('/')
        createOrganization(id)
        cy.findByLabelText('Identifier *').should('have.class', 'invalid')
        cy.deleteOrganization(`test-organization-key-${id}`, body.rows[0].id)
      })
  })
  it('User should not see deleted organization in the list', () => {
    const id = nanoid()
    cy.createOrganization({
      key: cy.getOrgKey(id),
      name: cy.getOrgName(id),
    }).as('create')

    cy.get('@create')
      .its('body')
      .then((body) => {
        cy.deleteOrganization(`test-organization-key-${id}`, body.rows[0].id)
      })

    cy.visit('/')
    cy.testId('loader-spinner').should('not.exist')
    cy.findByText(cy.getOrgName(id)).should('not.exist')
  })
  it.skip('User should not be able to visit deleted organization', () => {
    const id = nanoid()
    cy.createOrganization({
      key: cy.getOrgKey(id),
      name: cy.getOrgName(id),
    }).as('create')

    cy.get('@create')
      .its('body')
      .then((body) => {
        cy.deleteOrganization(cy.getOrgKey(id), body.rows[0].id)
      })

    cy.visit(`/${cy.getOrgKey(id)}`)
    cy.testId('loader-spinner').should('not.exist')
    cy.findByText('Dashboard').should('not.exist')
    cy.findByText('This organization does not exist').should('be.visible')
  })

  it.skip('User should not be able to visit organization hi is not invited to', () => {
    throw new Error('Not implemented')
  })
})

function createOrganization(id: string) {
  cy.testId('main-button').click()
  cy.findByLabelText('Identifier *').type(cy.getOrgKey(id))
  cy.findByLabelText('Name *').type(cy.getOrgName(id))
  cy.findByRole('button', { name: /Submit/i }).click()
}
