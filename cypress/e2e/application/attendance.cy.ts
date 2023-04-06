import { v4 } from 'uuid'
import { Activity } from '../../../src/types/activity'
import { Student } from '../../../src/types/student'
import studentPage from '../../drivers/studentPage'
import usersListPage from '../../drivers/usersListPage'
import { getOrgKey, getOrgName } from '../../support/commands/utils'

describe('Attendance', () => {
  const orgId = v4()
  const orgKey = getOrgKey(orgId)
  let orgDbId: number

  before(() => {
    cy.login()
    cy.createOrganization({
      key: orgKey,
      name: getOrgName(orgId),
    }).then(({ id }) => {
      orgDbId = id
    })
  })
  after(() => {
    cy.deleteOrganization(cy.getOrgKey(orgId), orgDbId)
  })

  beforeEach(() => {
    const studentOuterId = `test-student-${v4()}`
    cy.getUser().then((user) => {
      cy.addActivityDirectly(orgKey, {
        name: 'Test group',
        type: 'group',
        performerId: user.body.id,
      })
        .its('body')
        .as('activity')
    })
    cy.addStudentDirectly(orgKey, {
      tags: [],
      name: 'Test Student Name',
      outerId: studentOuterId,
    })
      .its('body')
      .as('participant')
    cy.get<Activity>('@activity').then((activity) => {
      cy.get<Student>('@participant').then((participant) => {
        cy.addStudentToGroupDirectly(orgKey, activity.id, participant.id)
      })
    })
  })
  afterEach(() => {
    cy.get<Activity>('@activity').then((activity) => {
      cy.removeActivityDirectly(orgKey, activity.id)
    })
    cy.get<Student>('@participant').then((participant) => {
      cy.removeStudentDirectly(orgKey, participant.id)
    })
    cy.removeAllAttendances(orgKey)
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

    cy.get<Student>('@participant').then((participant) => {
      cy.visit(`/${orgKey}/students/${participant.id}`)
    })

    studentPage.waitLoading()
    studentPage.getAttendance().should('have.text', '100%')
  })

  it('user attendance should should include only active groups', () => {
    cy.get<Activity>('@activity').then((activity) => {
      createAttendance(orgKey, {
        attended: {
          'test-student-1': true,
        },
        group: activity.outerId,
      })
    })

    createActivity(orgKey, {
      name: 'Test group to be closed',
      archived: true,
    }).then((group) => {
      createAttendance(orgKey, {
        attended: {
          'test-student-1': false,
        },
        group: group.outerId,
      })
    })

    cy.visit(`/${orgKey}/teachers`)
    usersListPage.waitLoading()
    usersListPage.getAttendance().should('have.text', '100%')
  })
})

function waitLoading() {
  cy.testId('loader-spinner').should('not.exist')
  cy.findByText('Loading').should('not.exist')
}

function chooseGroup(name: string) {
  cy.wait(300)
  cy.findByLabelText('Group').parent().click()
  cy.get('[id*=select-options]').findByText(name).click()
}

function chooseStudent(name: string) {
  cy.findByText(name).click()
}

function submit() {
  cy.findByRole('button', { name: /Submit/i }).click()
}

function createAttendance(orgKey: string, data: Partial<Parameters<typeof cy.createAttendance>[1]>) {
  cy.getUser().then((user) => {
    cy.createAttendance(orgKey, {
      attended: {},
      date: Date.now(),
      group: 'test-group-1',
      teacher: user.body.outerId,
      ...data,
    })
  })
}
function createActivity(orgKey: string, data: Partial<Parameters<typeof cy.addActivityDirectly>[1]>) {
  return cy.getUser().then((user) => {
    return cy
      .addActivityDirectly(orgKey, {
        name: 'Test group',
        type: 'group',
        performerId: user.body.id,
        ...data,
      })
      .its('body')
  })
}
