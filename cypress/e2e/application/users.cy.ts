import { v4 as uuidv4 } from 'uuid'
import userPage from '../../drivers/userPage'

// TODO: this is a draft

describe.skip('Users', () => {
  const orgId = uuidv4()
  const orgKey = `test-organization-key-${orgId}`
  const orgName = `test-organization-name-${orgId}`
  let orgDBId: number
  const testEmail = 'frunk.lern+99@checkinizer.com'

  before(() => {
    // cy.deleteUser(testEmail)
    // cy.exec('node ./cypress/cleanupFirebase.js', {
    //   env: { email: testEmail },
    // })
    cy.login()
    cy.createOrganization({
      key: orgKey,
      name: orgName,
    }).then(({ id }) => {
      orgDBId = id
    })
  })
  after(() => {
    cy.deleteOrganization(orgKey, orgDBId)
  })
  it.skip('User can register an account', () => {
    cy.logout()
    cy.visit(`/login`)

    cy.findByRole('link', { name: /Create account/i }).click()
    cy.findByLabelText(/name/i).type('new user')
    cy.findByLabelText(/email/i).type(testEmail)
    cy.findByLabelText(/password/i).type('secret{Enter}')

    cy.url().should('include', `/login`)

    cy.findByLabelText(/login/i).type(testEmail)
    cy.findByLabelText(/password/i).type('secret{Enter}')

    cy.findByRole('heading', { name: testEmail })
  })
  it.skip('Invite flow should work', () => {
    cy.visit(`/${orgKey}`)
    cy.findByRole('button', {
      name: 'Floating menu',
    }).click()
    cy.findByRole('button', {
      name: /Invite teacher/i,
    }).click()

    cy.findByLabelText(/email/i).type('frunk.lern@gmail.com{Enter}')

    const heading = cy.findByRole('heading', { name: /send the invitation link/i })
    heading.parent().within(() => {
      cy.findByRole('textbox').then((input) => {
        console.log('=-= input.val()', input.val())
        const url = input.val() as string
        cy.wrap(url).as('inviteUrl')
      })
    })

    cy.logout()
    cy.visit(`/login`)

    cy.findByRole('link', { name: /Create account/i }).click()
    cy.findByLabelText(/name/i).type('new user')
    cy.findByLabelText(/email/i).type(testEmail)
    cy.findByLabelText(/password/i).type('secret{Enter}')

    cy.url().should('include', `/login`)

    cy.findByLabelText(/login/i).type(testEmail)
    cy.findByLabelText(/password/i).type('secret{Enter}')

    cy.get<string>('@inviteUrl').then((url) => {
      cy.visit(url)
    })

    cy.findByRole('button', { name: /confirm/i }).click()

    cy.visit(`/${orgKey}`)
    // TODO: check if user see organization
  })
})

describe.skip('Teachers', () => {
  const orgId = uuidv4()
  // const orgKey = `test-organization-key-${orgId}`
  const orgKey = Cypress.env('TEST-ORGANIZATION-KEY')
  const orgName = `test-organization-name-${orgId}`
  const testEmail = `test-teacher@checkinizer.com`
  const password = 'secret'
  const teacherName = 'Teacher Teacher'
  let orgDBId: number
  let groupId: number

  before(() => {
    cy.login()
    // cy.createOrganization({
    //   key: orgKey,
    //   name: orgName,
    // }).then(({ id }) => {
    //   orgDBId = id
    cy.getOrganizationByKey(orgKey).then((org) => {
      orgDBId = org.id
    })
    // })
    // cy.createUserDirectly(teacherName, testEmail, password)
    cy.addActivityDirectly(orgKey, {
      name: 'test activity',
      performerId: null,
      type: 'group',
    }).then((res) => {
      groupId = res.body.id
    })
  })
  after(() => {
    // cy.removeActivityDirectly(orgKey, groupId)
    // cy.deleteOrganization(orgKey, orgDBId)
  })
  it('Admin can add a group to the teacher', () => {
    cy.visit(`/${orgKey}/teachers`)
    cy.findByText(`teacherName`).click()
    cy.findByRole('button', {
      name: /Assign Groups/i,
    }).click()
    cy.findByText(/test activity/i).click()
    cy.findByRole('button', {
      name: /ok/i,
    }).click()
    userPage.getDialog().should('not.be.visible')

    cy.findByText(/test activity/i).should('exist')
  })
  it.skip('Admin can remove a group from the teacher', () => {
    cy.visit(`/${orgKey}`)
    cy.findByRole('button', {
      name: 'Floating menu',
    }).click()
    cy.findByRole('button', {
      name: /Create class/i,
    }).click()
    cy.findByLabelText(/name/i).type('test class')
    cy.findByRole('button', {
      name: /Create/i,
    }).click()
    cy.findByRole('heading', { name: /test class/i })
  })
})
