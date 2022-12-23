import { nanoid } from 'nanoid'
import studentEditPage from '../../drivers/studentEditPage'
import studentPage from '../../drivers/studentPage'
import { getOrgKey, getOrgName } from '../../support/commands/utils'

describe('Students', () => {
  const orgId = nanoid()
  const orgKey = getOrgKey(orgId)
  let orgDbId: number
  let studentId: number

  before(() => {
    cy.login()

    cy.createOrganization({
      key: orgKey,
      name: getOrgName(orgId),
    })
      .its('id')
      .then((id) => {
        orgDbId = id

        cy.addStudentDirectly(orgKey, {
          tags: ['tag1', 'tag2'],
          name: 'Test Student Name',
          outerId: 'someId2',
        })
          .its('body.id')
          .then((id) => {
            studentId = id
          })
      })
  })
  after(() => {
    cy.removeStudentDirectly(orgKey, studentId)
    cy.deleteOrganization(orgKey, orgDbId)
  })

  it('User should be able to update student', () => {
    cy.visit(`/${orgKey}/students`)

    cy.findByText('Test Student Name').click()
    studentPage.waitLoading()
    cy.findByRole('button', { name: /edit/i }).click()
    studentEditPage.waitLoading()
    cy.findByLabelText(/name/i).clear().type('New Student Name')
    cy.findAllByTestId('CancelIcon').first().click()
    cy.findByLabelText(/tags/i).type('New tag{enter}')

    cy.findByRole('button', { name: /submit/i }).click()

    cy.findByText('Student has been successfully updated').should('exist')
    cy.url().should('contain', `/${orgKey}/students/${studentId}`)
    studentPage.waitLoading()
    cy.findByText('New Student Name').should('exist')
  })
})
