describe('Auth', () => {
  it('Redirect to login when no auth data', () => {
    cy.visit('/')
    cy.url().should('contain', '/login')
  })

  it('Show error message', () => {
    cy.visit('/login')
    cy.get('.preloader-wrapper').should('not.exist')
    cy.get('#identifier').type('wrong login')
    cy.get('#password').type('wrong password')
    cy.testId('submit').click()
    cy.getToastContent().should('not.be.empty')
  })

  // it.only('Redirect after register', () => {
  //   cy.visit('/register')
  //   cy.get('.preloader-wrapper').should('not.exist')
  //   cy.get('#email').type('test.1@domain.com')
  //   cy.get('#password').type('password')
  //   cy.testId('submit').click()

  //   cy.url().should('', '/login')
  // })
  // it.only('Redirect after login', () => {
  //   cy.get('.preloader-wrapper').should('not.exist')
  //   cy.get('#identifier').type('wrong login')
  //   cy.get('#password').type('wrong password')
  //   cy.testId('submit').click()
  //   cy.getToastContent().should('not.be.empty')
  // })
})
