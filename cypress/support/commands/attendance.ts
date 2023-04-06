import { v4 } from 'uuid'

function createAttendance(
  orgKey: string,
  data: {
    date: number
    attended: Record<string, boolean>
    group: string
    teacher: string
  }
) {
  const id = v4()
  cy.callFirestore('set', `organizations/${orgKey}/attendances/${id}`, {
    id,
    ...data,
  })
}

Cypress.Commands.add('createAttendance', createAttendance)
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      createAttendance: typeof createAttendance
    }
  }
}

function removeAllAttendances(orgKey: string) {
  cy.callFirestore('delete', `organizations/${orgKey}/attendances`)
}

Cypress.Commands.add('removeAllAttendances', removeAllAttendances)
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      removeAllAttendances: typeof removeAllAttendances
    }
  }
}
