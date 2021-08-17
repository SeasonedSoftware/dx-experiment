describe('Home page', () => {
  it('should find some expandable stories', () => {
    // Start from the index page
    cy.visit('/')

    cy.get('details').should('have.length', 3)
    cy.get('details:first-child p').should('not.be.visible')
    cy.get('details:first-child > summary').click()
    cy.get('details:first-child p').should('be.visible')
  })
})
