const page = {
  waitLoading() {
    cy.testId('loader-spinner').should('not.exist')
    cy.findByText('Loading').should('not.exist')
  },
  getAttendance() {
    return cy.findAllByTestId('attendance-rate-badge')
  },
}

export default page
