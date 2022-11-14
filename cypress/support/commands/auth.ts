const creds = {
  token: '',
  user: '',
}

export function loginAndSaveToken() {
  return cy.login().then(async (user) => {
    creds.user = user
    creds.token = await user.getIdToken()
  })
}
export function getToken() {
  return cy.wrap(creds.token)
}
