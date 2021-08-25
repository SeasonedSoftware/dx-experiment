describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders an empty backlog', () => {
    cy.get('h1').should('contain', 'Stories')
  })

  it('creates a new story', () => {
    cy.document().then((doc) => {
      const storiesLength = doc.querySelectorAll('details').length
      cy.get('textarea[name="asA"]').type('User')
      cy.get('textarea[name="iWant"]').type('Add a new story')
      cy.get('textarea[name="soThat"]').type('I can test the app')
      cy.get('button[type="submit"]').click()
      cy.get('details').should('have.length', storiesLength + 1)
    })
  })

  it('can expand story descriptions', () => {
    cy.get('details:first-child p').should('not.be.visible')
    cy.get('details:first-child > summary').click()
    cy.get('details:first-child p').should('be.visible')
  })
})
