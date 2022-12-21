import { nanoid } from 'nanoid'
import groupPage from '../../drivers/groupPage'

describe('Groups', () => {
  const orgId = nanoid()
  const orgKey = `test-organization-key-${orgId}`
  const orgName = `test-organization-name-${orgId}`
  let orgDBId = 0
  const id = nanoid()
  const name = `Group-${id}`

  before(() => {
    cy.login()
    cy.createOrganization({
      key: orgKey,
      name: orgName,
    }).then(({ id }) => {
      orgDBId = id
    })
    cy.log(`Created organization with key ${orgKey}`)
  })
  after(() => {
    cy.log(`Removing organization with key ${orgKey} and ID ${orgDBId}`)
    cy.deleteOrganization(orgKey, orgDBId)
  })
  beforeEach(() => {
    cy.addGroupDirectly(orgKey, id, {
      name: name,
      teacher: Cypress.env('TEST_UID'),
    })
    cy.addStudentDirectly(orgDBId, {
      name: `Student 1`,
      tags: [],
      outerId: `Student-1`,
    }).as(`createStudent`)
  })
  afterEach(() => {
    cy.removeGroupDirectly(orgKey, id)
    cy.get<Cypress.Response<{ id: number }>>('@createStudent').then((response) => {
      cy.removeStudentDirectly(orgDBId, response.body.id)
    })
    cy.callFirestore('delete', `organizations/${orgKey}/studentsToGroups`)
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
  it('Should be able to assign teacher', () => {
    addGroupAndVisitIt(orgKey)
    cy.findByText('No teacher assigned').should('exist')
    cy.findByRole('button', {
      name: /assign teacher/i,
    }).click()
    groupPage.getDialog().within(() => {
      cy.getFirebaseUser().then((user) => {
        cy.findByText(user.email).click()
      })
    })
    groupPage.getDialog().should('not.be.visible')

    cy.findByText('No teacher assigned').should('not.exist')
    cy.findByText('Teacher has been successfully assigned')
  })
  it('Should be able to assign students', () => {
    cy.visit(`/${orgKey}/groups/${id}`)

    addStudentToGroup('Student 1')

    cy.findByTestId('students-list').within(() => {
      cy.findByText('Student 1').should('exist')
    })
  })
  it('Should be able to unassign students', () => {
    cy.visit(`/${orgKey}/groups/${id}`)

    addStudentToGroup('Student 1')

    cy.findByTestId('students-list').within(() => {
      cy.findByRole('button', { name: /edit/i }).click()
    })
    cy.findAllByTestId('CancelIcon').click()
    cy.findByRole('button', { name: /ok/i }).click()

    cy.findByTestId('students-list').within(() => {
      cy.findByText('No students assigned').should('exist')
    })
  })
  it('Should be able to remove individual student from its context menu', () => {
    cy.visit(`/${orgKey}/groups/${id}`)

    addStudentToGroup('Student 1')

    cy.findByTestId('students-list').within(() => {
      cy.findByRole('button', { name: /more_horiz/i }).click()
      cy.findByRole('link', { name: /Remove from group/i }).click()
    })

    cy.findByTestId('students-list').within(() => {
      cy.findByText('No students assigned').should('exist')
    })
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
  })
  cy.visit(`/${orgKey}/groups/${id}`)
  cy.getSpinner().should('not.exist')
}

function addStudentToGroup(name: string) {
  cy.findByRole('button', { name: /assign students/i }).click()
  cy.findByLabelText('Enter a name').type(`${name}{enter}`)
  cy.findByRole('button', { name: /ok/i }).click()
}
