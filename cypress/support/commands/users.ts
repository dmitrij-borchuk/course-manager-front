export function createUserDirectly(name: string, email: string, password: string) {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('SERVER_URL')}/auth/register`,
    body: {
      name,
      email,
      password,
    },
  })
}
