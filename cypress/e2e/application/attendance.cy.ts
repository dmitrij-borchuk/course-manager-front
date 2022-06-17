describe('Attendance', () => {
  it('Should be on the teachers list', () => {
    cy.login('test.admin@domain.com', 'test.admin')
    cy.visit('/')
    cy.testId('addIcon').click()

    cy.visit('/t1/students')
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
