import { nanoid } from 'nanoid'
import { Activity } from '../../../src/types/activity'
import studentEditPage from '../../drivers/studentEditPage'
import studentPage from '../../drivers/studentPage'
import { getOrgKey, getOrgName } from '../../support/commands/utils'

describe('Students', () => {
  const orgId = nanoid()
  const orgKey = getOrgKey(orgId)
  let orgDbId: number
  let studentId: number
  let activity: Activity

  before(() => {
    cy.login()

    cy.createOrganization({
      key: orgKey,
      name: getOrgName(orgId),
    })
      .its('id')
      .then((id) => {
        orgDbId = id
      })
    cy.addActivityDirectly(orgKey, {
      name: 'Default Activity',
      performerId: null,
      type: 'group',
    })
      .its('body')
      .then((a) => {
        activity = a
      })
  })
  after(() => {
    cy.removeActivityDirectly(orgKey, activity.id)
    cy.deleteOrganization(orgKey, orgDbId)
  })

  beforeEach(() => {
    cy.addStudentDirectly(orgKey, {
      tags: ['tag1', 'tag2'],
      name: 'Test Student Name',
      outerId: `someId2-${nanoid()}`,
    })
      .its('body.id')
      .then((id) => {
        studentId = id
      })
  })
  afterEach(() => {
    cy.removeStudentDirectly(orgKey, studentId)
  })

  it('User should be able to update student', () => {
    cy.visit(`/${orgKey}/students`)

    cy.findByText('Test Student Name').click()
    studentPage.waitLoading()
    cy.findByRole('button', { name: /edit/i }).click()
    studentEditPage.waitLoading()
    cy.findByLabelText(/name/i).clear().type('Student Name To Update')
    cy.findAllByTestId('CancelIcon').first().click()
    cy.findByLabelText(/tags/i).type('New tag{enter}')

    cy.findByRole('button', { name: /submit/i }).click()

    cy.findByText('Student has been successfully updated').should('exist')
    cy.url().should('contain', `/${orgKey}/students/${studentId}`)
    studentPage.waitLoading()
    cy.findByText('Student Name To Update').should('exist')
  })

  it('User should be able to create student', () => {
    cy.visit(`/${orgKey}/students`)

    cy.findByLabelText('Floating menu').click()
    cy.findByLabelText(/name/i).type('New Student Name')
    cy.findByLabelText(/tags/i).type('New tag{enter}')

    cy.findByRole('button', { name: /submit/i }).click()

    cy.findByText('Student has been successfully created').should('exist')
    studentPage.waitLoading()
    cy.findByText('New Student Name').should('exist')
  })

  it('User should not see deleted students', () => {
    cy.addStudentDirectly(orgKey, {
      tags: [],
      name: 'Student To Delete',
      outerId: `someId2-${nanoid()}`,
    })
      .its('body.id')
      .then((id) => {
        studentId = id
      })

    cy.visit(`/${orgKey}/students`)

    cy.findByText('Student To Delete').click()
    studentPage.waitLoading()
    cy.findByRole('button', { name: /delete/i }).click()
    cy.findByRole('button', { name: /yes/i }).click()
    cy.findByRole('heading', { name: /Students/i }).should('exist')
    cy.findByTestId('skeleton-loader').should('not.exist')
    cy.findByText('Student To Delete').should('not.exist')
  })

  it('User should be able to assign groups to user', () => {
    cy.visit(`/${orgKey}/students/${studentId}`)

    cy.findByRole('button', { name: /Assign Groups/i }).click()
    cy.findByText(activity.name).click()
    cy.findByRole('button', { name: /ok/i }).click()
    cy.getToastContent().should('contain.text', `Groups have been successfully assigned`)
    cy.findByText(activity.name).should('exist')
  })

  it('User should be able to unassign groups to user', () => {
    cy.addStudentToGroupDirectly(orgKey, activity.id, studentId)

    cy.visit(`/${orgKey}/students/${studentId}`)

    cy.findByRole('heading', { name: /groups/i })
      .parent()
      .within(() => {
        cy.findByRole('button', { name: /edit/i }).click()
      })

    cy.findByTestId('assign-group-dialog').within(() => {
      cy.findByText(activity.name).click()
      cy.findByRole('button', { name: /ok/i }).click()
    })
    cy.getToastContent().should('contain.text', `Groups have been successfully assigned`)
    cy.findByText(activity.name).should('not.exist')
  })
})
