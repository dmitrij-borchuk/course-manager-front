describe('Students', () => {
  it('Should be on the group page when there is more that 10 students assigned', () => {
    // cy.intercept('http://localhost:8080/**', {
    //   statusCode: 200,
    // })
    // cy.intercept('https://firebase.googleapis.com/**')
    // cy.intercept('POST', 'http://localhost:8080/**', {
    //   statusCode: 200,
    // })
    cy.login('test.admin@domain.com', 'test.admin')
    cy.makeOrganizationIfNotExists()
    cy.makeStudentList('organization', 10)
    // cy.visit('/')
    // cy.testId('addIcon').click()

    // cy.visit('/t1/students')
    // cy.get('.preloader-wrapper').should('not.exist')
    // cy.get('#identifier').type('wrong login')
    // cy.get('#password').type('wrong password')
    // cy.testId('submit').click()
    // cy.getToastContent().should('not.be.empty')
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
