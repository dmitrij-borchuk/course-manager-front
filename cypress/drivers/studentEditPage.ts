const page = {
  waitLoading() {
    cy.testId('loader-spinner').should('not.exist')
    cy.findByText('Loading').should('not.exist')
  },
}

export default page
